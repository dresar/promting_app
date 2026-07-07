import 'dart:io';
import 'dart:convert';
import '../database/database_service.dart';
/// Membaca konfigurasi aplikasi dari tabel app_config di Neon PostgreSQL.
/// Menyimpan cache agar tidak query ulang setiap kali.
class AppConfigService {
  static AppConfigService? _instance;
  final Map<String, String> _cache = {};

  AppConfigService._();

  static AppConfigService get instance {
    _instance ??= AppConfigService._();
    return _instance!;
  }

  /// Muat semua config dari database ke cache
  Future<void> loadAll() async {
    final result = await DatabaseService.instance.execute(
      'SELECT key, value FROM app_config',
    );
    _cache.clear();
    for (final row in result) {
      final key = row[0] as String;
      final value = row[1] as String;
      _cache[key] = value;
    }
  }

  /// Ambil nilai konfigurasi. Jika belum di-load, load dulu.
  Future<String?> get(String key) async {
    if (_cache.isEmpty) {
      await loadAll();
    }
    return _cache[key];
  }

  // --- Shortcut getters untuk keys yang sering dipakai ---

  Future<String> get imagekitPublicKey async =>
      await get('imagekit_public_key') ?? '';

  Future<String> get imagekitPrivateKey async =>
      await get('imagekit_private_key') ?? '';

  Future<String> get imagekitUrlEndpoint async =>
      await get('imagekit_url_endpoint') ?? '';

  Future<String> get jwtSecret async =>
      await get('jwt_secret') ??
      'promptstudio_access_secret_key_change_this_in_production_2024';

  Future<String> get jwtRefreshSecret async =>
      await get('jwt_refresh_secret') ??
      'promptstudio_refresh_secret_key_change_this_in_production_2024';

  Future<String> get groqApiKey async {
    // 1. Coba ambil dari tabel groq_api_keys yang paling sedikit errornya
    try {
      final result = await DatabaseService.instance.execute('''
        SELECT api_key FROM groq_api_keys
        WHERE is_active = \$1 OR is_active = \$2
        ORDER BY error_count ASC, last_used_at ASC
        LIMIT 1
      ''', [true, 1]);
      if (result.isNotEmpty) {
        final bestKey = result.first[0].toString();
        // Update last_used_at
        await DatabaseService.instance.execute(
          'UPDATE groq_api_keys SET last_used_at = NOW() WHERE api_key = \$1',
          [bestKey]
        );
        return bestKey;
      }
    } catch (e) {
      print('Gagal mengambil groq_api_keys: $e');
    }

    // 2. Fallback ke app_config (lama)
    return await get('groq_api_key') ?? '';
  }

  /// Menandai API key bermasalah agar turun prioritasnya
  Future<void> markGroqApiKeyFailed(String apiKey) async {
    try {
      await DatabaseService.instance.execute(
        'UPDATE groq_api_keys SET error_count = error_count + 1 WHERE api_key = \$1',
        [apiKey]
      );
    } catch (e) {
      print('Gagal update error_count: $e');
    }
  }

  /// Perbarui nilai config di DB dan cache
  Future<void> set(String key, String value) async {
    await DatabaseService.instance.execute(
      'INSERT INTO app_config(key, value, updated_at) VALUES(\$1, \$2, NOW()) ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()',
      [key, value],
    );
    _cache[key] = value;
  }

  /// Memasukkan data awal dari json jika diperlukan
  Future<void> seedFromJson() async {
    try {
      final file = File('app_config.json');
      if (file.existsSync()) {
        final content = await file.readAsString();
        final List<dynamic> jsonList = jsonDecode(content);
        for (var item in jsonList) {
          final key = item['key'];
          final value = item['value'];
          if (key != 'groq_api_key') {
            await set(key, value);
          } else {
             // For groq api key, insert to groq_api_keys table
             try {
               await DatabaseService.instance.execute(
                 'INSERT INTO groq_api_keys (id, api_key, is_active, error_count) VALUES (\$1, \$2, \$3, \$4)',
                 ['seed-groq', value, true, 0]
               );
             } catch (_) {}
          }
        }
      }
    } catch (e) {
      print('Failed to seed config: $e');
    }
  }

  /// Reset cache agar baca ulang dari DB
  void invalidateCache() => _cache.clear();
}
