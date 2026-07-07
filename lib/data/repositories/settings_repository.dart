import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/models/settings.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';

class SettingsRepository {
  final ApiClient _apiClient;

  SettingsRepository(SecureStorageService secureStorage, this._apiClient);

  // ─── Get Settings ──────────────────────────────────────────────────────────

  Future<UserSettings> getSettings() async {
    final response = await _apiClient.get('/api/settings');

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil pengaturan.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return UserSettings.fromJson(data);
  }

  // ─── Update Settings ───────────────────────────────────────────────────────

  Future<UserSettings> updateSettings(UserSettings settings) async {
    final response = await _apiClient.post(
      '/api/settings',
      body: {
        'theme': settings.theme,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui pengaturan.',
        statusCode: response.statusCode,
      );
    }

    return settings;
  }
}
