import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/models/favorite_prompt.dart';
import 'package:promting_app/data/models/pagination.dart';
import 'package:promting_app/data/models/prompt_history.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';

class PaginatedPromptHistories {
  final List<PromptHistory> histories;
  final Pagination pagination;

  PaginatedPromptHistories({required this.histories, required this.pagination});
}

class PaginatedFavorites {
  final List<FavoritePrompt> favorites;
  final Pagination pagination;

  PaginatedFavorites({required this.favorites, required this.pagination});
}

class PromptRepository {
  final ApiClient _apiClient;
  final SecureStorageService _secureStorage;

  PromptRepository(this._secureStorage, this._apiClient);

  // ─── Generate Prompt ───────────────────────────────────────────────────────

  Future<PromptHistory> generatePrompt({
    required String title,
    required String contentType,
    required int slideCount,
    required String designStyle,
    required String targetAudience,
    required String imageOrientation,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate',
      body: {
        'title': title,
        'contentType': contentType,
        'slideCount': slideCount,
        'designStyle': designStyle,
        'targetAudience': targetAudience,
        'imageOrientation': imageOrientation,
        'includeCaption': includeCaption,
        'characterId': characterId,
        'useCharacter': useCharacter,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  Future<PromptHistory> generateAdPrompt({
    required String title,
    required String contentType,
    required int slideCount,
    required String designStyle,
    required String targetAudience,
    required String imageOrientation,
    required String? sourceImageUrl,
    required String description,
    required String? brand,
    required String? price,
    required String? sellingPoints,
    required String? cta,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate-ad',
      body: {
        'title': title,
        'contentType': contentType,
        'slideCount': slideCount,
        'designStyle': designStyle,
        'targetAudience': targetAudience,
        'imageOrientation': imageOrientation,
        'sourceImageUrl': sourceImageUrl,
        'description': description,
        'brand': brand,
        'price': price,
        'sellingPoints': sellingPoints,
        'cta': cta,
        'includeCaption': includeCaption,
        'characterId': characterId,
        'useCharacter': useCharacter,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt iklan.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  Future<PromptHistory> generateBannerPrompt({
    required String title,
    required String contentType,
    required String businessType,
    required String designStyle,
    required String description,
    required String layoutSize,
    required String? contactInfo,
    required String? sourceImageUrl,
    bool includeCaption = true,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate-banner',
      body: {
        'title': title,
        'contentType': contentType,
        'businessType': businessType,
        'designStyle': designStyle,
        'description': description,
        'layoutSize': layoutSize,
        'contactInfo': contactInfo,
        'sourceImageUrl': sourceImageUrl,
        'includeCaption': includeCaption,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt banner.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  Future<PromptHistory> generateLogoPrompt({
    required String title,
    required String contentType,
    required String designStyle,
    required String description,
    required String layoutSize,
    required String shape,
    required int slideCount,
    required String? sourceImageUrl,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate-logo',
      body: {
        'title': title,
        'contentType': contentType,
        'designStyle': designStyle,
        'description': description,
        'layoutSize': layoutSize,
        'shape': shape,
        'slideCount': slideCount,
        'sourceImageUrl': sourceImageUrl,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt logo.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  Future<PromptHistory> generateQuotePrompt({
    required String quoteText,
    String? quoteAuthor,
    String? characterId,
    bool? useCharacter,
    String imageOrientation = 'Persegi (Square 1:1)',
    String? moodOverride,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate-quote',
      body: {
        'quoteText': quoteText,
        'quoteAuthor': quoteAuthor,
        'characterId': characterId,
        'useCharacter': useCharacter,
        'imageOrientation': imageOrientation,
        'moodOverride': moodOverride,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt kata mutiara.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  // ─── Generate Digital Product Prompt ──────────────────────────────────────

  Future<PromptHistory> generateDigitalProductPrompt({
    required String title,
    required String slideCount,
    required String designStyle,
    required String targetAudience,
    required String description,
    String? brand,
    String? price,
    String? productType,
    String? additionalPrompt,
    String? sourceImageUrl,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
    String? color1,
    String? color2,
  }) async {
    final response = await _apiClient.post(
      '/api/prompt/generate-digital-product',
      body: {
        'title': title,
        'slideCount': int.tryParse(slideCount) ?? 3,
        'designStyle': designStyle,
        'targetAudience': targetAudience,
        'description': description,
        'brand': brand,
        'price': price,
        'productType': productType,
        'additionalPrompt': additionalPrompt,
        'sourceImageUrl': sourceImageUrl,
        'includeCaption': includeCaption,
        'characterId': characterId,
        'useCharacter': useCharacter,
        'color1': color1,
        'color2': color2,
        'contentType': 'Produk Digital',
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat prompt produk digital.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }



  // ─── Get Prompt History ────────────────────────────────────────────────────

  Future<PaginatedPromptHistories> getPromptHistory({
    int page = 1,
    int limit = 10,
    String? contentType,
  }) async {
    String url = '/api/prompt/history?page=$page&limit=$limit';
    if (contentType != null && contentType.isNotEmpty && contentType != 'Semua') {
      url += '&contentType=${Uri.encodeComponent(contentType)}';
    }
    final response = await _apiClient.get(url);
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil histori prompt.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final List<dynamic> list = data['histories'];
    final histories = list.map((item) => PromptHistory.fromJson(item)).toList();

    return PaginatedPromptHistories(
      histories: histories,
      pagination: Pagination.fromJson(data['pagination']),
    );
  }

  // ─── Get History By Id ─────────────────────────────────────────────────────

  Future<PromptHistory> getPromptHistoryById(String id) async {
    final response = await _apiClient.get('/api/prompt/history/$id');
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Prompt history tidak ditemukan.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return PromptHistory.fromJson(data);
  }

  // ─── Delete History ────────────────────────────────────────────────────────

  Future<void> deleteHistory(String id) async {
    final response = await _apiClient.delete('/api/prompt/history/$id');
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus history.',
        statusCode: response.statusCode,
      );
    }
  }

  // ─── Update History ────────────────────────────────────────────────────────

  Future<void> updateHistory(String id, String title, List<String> imageUrls) async {
    final response = await _apiClient.put(
      '/api/prompt/history/$id',
      body: {
        'title': title,
        'imageUrl': imageUrls.isEmpty ? null : jsonEncode(imageUrls),
      }
    );
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui history.',
        statusCode: response.statusCode,
      );
    }
  }

  Future<String> uploadImage(String filePath, {List<int>? bytes, String? fileName}) async {
    final response = await _apiClient.uploadFile(
      '/api/upload',
      filePath,
      bytes: bytes,
      fileName: fileName,
    );
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengupload gambar.',
        statusCode: response.statusCode,
      );
    }
    final data = jsonDecode(response.body);
    return data['url'] as String;
  }

  // ─── Get Favorites ─────────────────────────────────────────────────────────

  Future<PaginatedFavorites> getFavoritePrompts({
    int page = 1,
    int limit = 10,
  }) async {
    final response = await _apiClient.get('/api/prompt/favorites?page=$page&limit=$limit');
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil favorit prompt.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final List<dynamic> list = data['favorites'];
    final favorites = list.map((item) => FavoritePrompt.fromJson(item)).toList();

    return PaginatedFavorites(
      favorites: favorites,
      pagination: Pagination.fromJson(data['pagination']),
    );
  }

  // ─── Add Favorite ──────────────────────────────────────────────────────────

  Future<void> addFavorite(String promptHistoryId) async {
    final response = await _apiClient.post('/api/prompt/favorite/$promptHistoryId');
    
    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menambah ke favorit.',
        statusCode: response.statusCode,
      );
    }
  }

  // ─── Remove Favorite ───────────────────────────────────────────────────────

  Future<void> removeFavorite(String promptHistoryId) async {
    final response = await _apiClient.delete('/api/prompt/favorite/$promptHistoryId');
    
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus dari favorit.',
        statusCode: response.statusCode,
      );
    }
  }
}
