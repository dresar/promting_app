import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/core/database/database_service.dart';
import 'package:promting_app/data/models/character.dart';

class TargetAudience {
  final String id;
  final String name;
  const TargetAudience({required this.id, required this.name});

  factory TargetAudience.fromJson(Map<String, dynamic> json) {
    return TargetAudience(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }
}

class DigitalProductType {
  final String id;
  final String name;
  const DigitalProductType({required this.id, required this.name});

  factory DigitalProductType.fromJson(Map<String, dynamic> json) {
    return DigitalProductType(
      id: json['id'] as String,
      name: json['name'] as String,
    );
  }
}

class DesignStyle {
  final String id;
  final String name;
  final String? description;
  final String? prompt;
  final String? imageUrl;
  const DesignStyle({required this.id, required this.name, this.description, this.prompt, this.imageUrl});

  factory DesignStyle.fromJson(Map<String, dynamic> json) {
    return DesignStyle(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      prompt: json['prompt'] as String?,
      imageUrl: json['imageUrl'] as String?,
    );
  }
}

class AppOptionsRepository {
  final ApiClient _apiClient;
  final DatabaseService _databaseService;

  // ─── Memory Caches for Instantly Fast Access ────────────────────────────────
  static List<TargetAudience>? _cachedAudiences;
  static List<DesignStyle>? _cachedStyles;
  static final Map<String, List<DesignStyle>> _cachedThemes = {};
  static List<Character>? _cachedCharacters;
  static List<DigitalProductType>? _cachedProductTypes;

  AppOptionsRepository(this._apiClient, this._databaseService);

  // ─── Local Fallback Data (Saves offline from API error 500) ──────────────────
  static const _defaultAudiences = [
    TargetAudience(id: 'aud-1', name: 'Pemilik Bisnis / UMKM'),
    TargetAudience(id: 'aud-2', name: 'Mahasiswa / Pelajar'),
    TargetAudience(id: 'aud-3', name: 'Content Creator / Influencer'),
    TargetAudience(id: 'aud-4', name: 'Karyawan Swasta / Profesional'),
    TargetAudience(id: 'aud-5', name: 'Ibu Rumah Tangga / Reseller'),
  ];

  static const _defaultStyles = [
    DesignStyle(
      id: 'style-1',
      name: 'Minimalist Modern',
      description: 'Bersih, lapang, warna monokromatik modern',
      prompt: 'Desain datar (2D) sederhana, bersih dengan banyak ruang kosong, palet warna minimalis (seperti putih, abu-abu muda, biru tua/navy), tipografi sans-serif bersih, tanpa objek 3D, tanpa efek 3D, ilustrasi datar bergaya flat art, rapi, minimalis modern, latar belakang bersih.',
      imageUrl: '/assets/uploads/mr4ef89n3xd2d.png',
    ),
    DesignStyle(
      id: 'style-2',
      name: 'Vibrant & Bold',
      description: 'Warna kontras berani, layout ekspresif',
      prompt: 'Menggunakan warna kontras yang sangat berani (seperti neon, kuning menyala, merah, ungu), elemen grafis abstrak, tata letak dinamis, ilustrasi modern 2D, tipografi tebal (bold) yang mencolok, tanpa objek 3D.',
      imageUrl: '/assets/uploads/mr4n3a2t6vspc.png',
    ),
    DesignStyle(
      id: 'style-3',
      name: 'Corporate Elegant',
      description: 'Formal, dominan biru/navy premium',
      prompt: 'Gaya profesional formal, warna biru navy, abu-abu, dan putih, tata letak terstruktur rapi, ikon bisnis datar, tipografi bersih, elegan dan terpercaya, tanpa objek 3D.',
      imageUrl: '/assets/uploads/mr4nd797hg7jc.png',
    ),
    DesignStyle(
      id: 'style-4',
      name: 'Playful & Colorful',
      description: 'Desain imut, kartun 2D bersahabat',
      prompt: 'Gaya ilustratif kartun 2D yang ceria, warna-warni cerah dan hangat, cocok untuk anak-anak atau audiens muda, ikon lucu, tipografi ramah dan mudah dibaca, tanpa objek 3D.',
      imageUrl: '/assets/uploads/mr4nho3t2cycu.png',
    ),
  ];

  static const _defaultProductTypes = [
    DigitalProductType(id: 'type-1', name: 'E-book / Buku Digital'),
    DigitalProductType(id: 'type-2', name: 'Online Course / Kelas Online'),
    DigitalProductType(id: 'type-3', name: 'Template Desain (Canva, Figma, dll)'),
    DigitalProductType(id: 'type-4', name: 'Preset Foto / Lightroom Preset'),
    DigitalProductType(id: 'type-5', name: 'Aplikasi / Software / SaaS'),
    DigitalProductType(id: 'type-6', name: 'Plugin / Add-on / Extension'),
    DigitalProductType(id: 'type-7', name: 'Kursus / Video Panduan'),
    DigitalProductType(id: 'type-8', name: 'Digital Art / Wallpaper'),
    DigitalProductType(id: 'type-9', name: 'Tools & Resources Pack'),
    DigitalProductType(id: 'type-10', name: 'Membership / Komunitas'),
  ];

  // ─── Target Audiences ─────────────────────────────────────────────────────

  Future<List<TargetAudience>> getTargetAudiences() async {
    // 1. Kembalikan memori cache jika ada
    if (_cachedAudiences != null && _cachedAudiences!.isNotEmpty) {
      // Trigger background sync secara diam-diam
      _syncAudiencesBackground();
      return _cachedAudiences!;
    }

    // 2. Ambil dari SQLite local secara cepat
    final localData = await _databaseService.execute('SELECT id, name FROM target_audiences');
    if (localData.isNotEmpty) {
      _cachedAudiences = localData.map<TargetAudience>((row) => TargetAudience(
        id: row[0].toString(),
        name: row[1].toString(),
      )).toList();
      _syncAudiencesBackground();
      return _cachedAudiences!;
    }

    // 3. Fallback jika SQLite kosong, seed data default agar tidak kosong
    _cachedAudiences = List.from(_defaultAudiences);
    for (var aud in _defaultAudiences) {
      await _databaseService.execute(
        'INSERT OR IGNORE INTO target_audiences (id, name) VALUES (\$1, \$2)',
        [aud.id, aud.name],
      );
    }
    _syncAudiencesBackground();
    return _cachedAudiences!;
  }

  Future<void> _syncAudiencesBackground() async {
    try {
      final response = await _apiClient.get('/api/options/audiences', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => TargetAudience.fromJson(item)).toList();
        
        await _databaseService.execute('DELETE FROM target_audiences');
        for (var aud in list) {
          await _databaseService.execute(
            'INSERT INTO target_audiences (id, name) VALUES (\$1, \$2)',
            [aud.id, aud.name],
          );
        }
        _cachedAudiences = list;
      }
    } catch (_) {
      // diam-diam abaikan error agar tidak memblokir UI
    }
  }

  Future<void> createTargetAudience(String name) async {
    final response = await _apiClient.post(
      '/api/options/audiences',
      body: {'name': name},
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat target audiens.',
        statusCode: response.statusCode,
      );
    }
    _cachedAudiences = null; // Reset cache agar sync berikutnya mengambil yang baru
  }

  Future<void> deleteTargetAudience(String id) async {
    final response = await _apiClient.delete('/api/options/audiences/$id');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus target audiens.',
        statusCode: response.statusCode,
      );
    }
    _cachedAudiences = null;
  }

  Future<void> updateTargetAudience(String id, String name) async {
    final response = await _apiClient.put(
      '/api/options/audiences/$id',
      body: {'name': name},
    );
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui target audiens.',
        statusCode: response.statusCode,
      );
    }
    _cachedAudiences = null;
  }

  // ─── Design Styles ────────────────────────────────────────────────────────

  Future<List<DesignStyle>> getDesignStyles() async {
    // 1. Kembalikan memori cache jika ada
    if (_cachedStyles != null && _cachedStyles!.isNotEmpty) {
      _syncStylesBackground();
      return _cachedStyles!;
    }

    // 2. Ambil dari SQLite local
    final localData = await _databaseService.execute('SELECT id, name, description, prompt, imageUrl FROM design_styles');
    if (localData.isNotEmpty) {
      _cachedStyles = localData.map<DesignStyle>((row) => DesignStyle(
        id: row[0].toString(),
        name: row[1].toString(),
        description: row[2]?.toString(),
        prompt: row[3]?.toString(),
        imageUrl: row[4]?.toString(),
      )).toList();
      _syncStylesBackground();
      return _cachedStyles!;
    }

    // 3. Fallback jika SQLite kosong, seed data default
    _cachedStyles = List.from(_defaultStyles);
    for (var style in _defaultStyles) {
      await _databaseService.execute(
        'INSERT OR IGNORE INTO design_styles (id, name, description, prompt, imageUrl) VALUES (\$1, \$2, \$3, \$4, \$5)',
        [style.id, style.name, style.description, style.prompt, style.imageUrl],
      );
    }
    _syncStylesBackground();
    return _cachedStyles!;
  }

  Future<void> _syncStylesBackground() async {
    try {
      final response = await _apiClient.get('/api/options/styles', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => DesignStyle.fromJson(item)).toList();
        
        await _databaseService.execute('DELETE FROM design_styles');
        for (var style in list) {
          await _databaseService.execute(
            'INSERT INTO design_styles (id, name, description, prompt, imageUrl) VALUES (\$1, \$2, \$3, \$4, \$5)',
            [style.id, style.name, style.description, style.prompt, style.imageUrl],
          );
        }
        _cachedStyles = list;
      }
    } catch (_) {}
  }

  Future<void> createDesignStyle({required String name, String? description, String? prompt, String? imageUrl}) async {
    final response = await _apiClient.post(
      '/api/options/styles',
      body: {
        'name': name,
        'description': description,
        'prompt': prompt,
        'imageUrl': imageUrl,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat gaya desain.',
        statusCode: response.statusCode,
      );
    }
    _cachedStyles = null;
  }

  Future<void> updateDesignStyle(String id, {required String name, String? description, String? prompt, String? imageUrl}) async {
    final response = await _apiClient.put(
      '/api/options/styles/$id',
      body: {
        'name': name,
        'description': description,
        'prompt': prompt,
        'imageUrl': imageUrl,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui gaya desain.',
        statusCode: response.statusCode,
      );
    }
    _cachedStyles = null;
  }

  Future<void> deleteDesignStyle(String id) async {
    final response = await _apiClient.delete('/api/options/styles/$id');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus gaya desain.',
        statusCode: response.statusCode,
      );
    }
    _cachedStyles = null;
  }

  // ─── Groq API Keys ────────────────────────────────────────────────────────

  Future<List<Map<String, dynamic>>> getGroqApiKeys() async {
    final response = await _apiClient.get('/api/options/groq-keys');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil Groq API keys.',
        statusCode: response.statusCode,
      );
    }

    final List<dynamic> data = jsonDecode(response.body);
    return data.map((item) => Map<String, dynamic>.from(item)).toList();
  }

  Future<void> addGroqApiKey(String apiKey) async {
    final response = await _apiClient.post(
      '/api/options/groq-keys',
      body: {'apiKey': apiKey},
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menyimpan API Key.',
        statusCode: response.statusCode,
      );
    }
  }

  Future<void> deleteGroqApiKey(String id) async {
    final response = await _apiClient.delete('/api/options/groq-keys/$id');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus API Key.',
        statusCode: response.statusCode,
      );
    }
  }

  Future<void> resetGroqApiKeyErrors(String id) async {
    final response = await _apiClient.post(
      '/api/options/groq-keys/$id/reset',
      body: {},
    );
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mereset error count.',
        statusCode: response.statusCode,
      );
    }
  }

  // ─── Themes ───────────────────────────────────────────────────────────────

  Future<List<DesignStyle>> getThemes(String category) async {
    // 1. Ambil dari memory cache jika ada
    if (_cachedThemes.containsKey(category) && _cachedThemes[category]!.isNotEmpty) {
      _syncThemesBackground(category);
      return _cachedThemes[category]!;
    }

    // 2. Jika memori cache kosong, coba sync API secara synchronous (await)
    try {
      final response = await _apiClient.get('/api/options/themes?category=$category', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => DesignStyle.fromJson(item)).toList();
        if (list.isNotEmpty) {
          _cachedThemes[category] = list;
          return list;
        }
      }
    } catch (e) {
      print('Sync themes failed: $e.');
    }

    // 3. Jika API gagal/500, kembalikan [] agar UI memanggil getDesignStyles() secara offline-first
    return [];
  }

  Future<void> _syncThemesBackground(String category) async {
    try {
      final response = await _apiClient.get('/api/options/themes?category=$category', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => DesignStyle.fromJson(item)).toList();
        _cachedThemes[category] = list;
      }
    } catch (_) {}
  }

  // ─── Characters ───────────────────────────────────────────────────────────

  Future<List<Character>> getCharacters() async {
    // 1. Memori cache jika ada
    if (_cachedCharacters != null && _cachedCharacters!.isNotEmpty) {
      _syncCharactersBackground();
      return _cachedCharacters!;
    }

    // 2. Jika kosong, panggil API secara synchronous (await)
    try {
      final response = await _apiClient.get('/api/options/characters', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => Character.fromJson(item)).toList();
        _cachedCharacters = list;
        return list;
      }
    } catch (e) {
      print('Sync characters failed: $e.');
    }

    return _cachedCharacters ?? [];
  }

  Future<void> _syncCharactersBackground() async {
    try {
      final response = await _apiClient.get('/api/options/characters', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => Character.fromJson(item)).toList();
        _cachedCharacters = list;
      }
    } catch (_) {}
  }

  // ─── Digital Product Types ───────────────────────────────────────────────

  Future<List<DigitalProductType>> getDigitalProductTypes() async {
    // 1. Kembalikan memori cache jika ada
    if (_cachedProductTypes != null && _cachedProductTypes!.isNotEmpty) {
      _syncProductTypesBackground();
      return _cachedProductTypes!;
    }

    // 2. Ambil dari SQLite local
    final localData = await _databaseService.execute('SELECT id, name FROM digital_product_types');
    if (localData.isNotEmpty) {
      _cachedProductTypes = localData.map<DigitalProductType>((row) => DigitalProductType(
        id: row[0].toString(),
        name: row[1].toString(),
      )).toList();
      _syncProductTypesBackground();
      return _cachedProductTypes!;
    }

    // 3. Fallback jika SQLite kosong, seed data default
    _cachedProductTypes = List.from(_defaultProductTypes);
    for (var t in _defaultProductTypes) {
      await _databaseService.execute(
        'INSERT OR IGNORE INTO digital_product_types (id, name) VALUES (\$1, \$2)',
        [t.id, t.name],
      );
    }
    _syncProductTypesBackground();
    return _cachedProductTypes!;
  }

  Future<void> _syncProductTypesBackground() async {
    try {
      final response = await _apiClient.get('/api/options/digital-product-types', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => DigitalProductType.fromJson(item)).toList();
        
        await _databaseService.execute('DELETE FROM digital_product_types');
        for (var t in list) {
          await _databaseService.execute(
            'INSERT INTO digital_product_types (id, name) VALUES (\$1, \$2)',
            [t.id, t.name],
          );
        }
        _cachedProductTypes = list;
      }
    } catch (_) {}
  }
}
