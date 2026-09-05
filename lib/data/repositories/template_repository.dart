import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/models/category.dart';
import 'package:promting_app/data/models/pagination.dart';
import 'package:promting_app/data/models/template.dart';

class PaginatedTemplates {
  final List<Template> templates;
  final Pagination pagination;

  PaginatedTemplates({required this.templates, required this.pagination});
}

class TemplateRepository {
  final ApiClient _apiClient;

  TemplateRepository(this._apiClient);

  Future<PaginatedTemplates> getTemplates({
    String? categoryId,
    bool? isPremium,
    int page = 1,
    int limit = 10,
  }) async {
    final queryParams = <String>[];
    queryParams.add('page=$page');
    queryParams.add('limit=$limit');
    if (categoryId != null) queryParams.add('categoryId=$categoryId');
    if (isPremium != null) queryParams.add('isPremium=$isPremium');

    final path = '/api/templates?${queryParams.join('&')}';
    final response = await _apiClient.get(path, requireAuth: false);

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil templates.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final List<dynamic> list = data['templates'];
    final templates = list.map((item) => Template.fromJson(item)).toList();

    return PaginatedTemplates(
      templates: templates,
      pagination: Pagination.fromJson(data['pagination']),
    );
  }

  Future<PaginatedTemplates> searchTemplates(
    String query, {
    int page = 1,
    int limit = 10,
  }) async {
    final path = '/api/templates/search?query=$query&page=$page&limit=$limit';
    final response = await _apiClient.get(path, requireAuth: false);

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mencari templates.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final List<dynamic> list = data['templates'];
    final templates = list.map((item) => Template.fromJson(item)).toList();

    return PaginatedTemplates(
      templates: templates,
      pagination: Pagination.fromJson(data['pagination']),
    );
  }

  Future<Template> getTemplateById(String id) async {
    final response = await _apiClient.get('/api/templates/$id', requireAuth: false);

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Template tidak ditemukan.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return Template.fromJson(data);
  }

  Future<Template> createTemplate({
    required String title,
    required String content,
    required String categoryId,
    String? description,
    String? thumbnailUrl,
  }) async {
    final response = await _apiClient.post(
      '/api/templates',
      body: {
        'title': title,
        'content': content,
        'categoryId': categoryId,
        'description': description,
        'thumbnailUrl': thumbnailUrl,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat template.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return Template.fromJson(data);
  }

  Future<void> deleteTemplate(String id) async {
    final response = await _apiClient.delete('/api/templates/$id');

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus template.',
        statusCode: response.statusCode,
      );
    }
  }

  Future<void> updateTemplate({
    required String id,
    required String title,
    required String content,
    required String categoryId,
    String? description,
    String? thumbnailUrl,
    bool? isPremium,
  }) async {
    final response = await _apiClient.put(
      '/api/templates/$id',
      body: {
        'title': title,
        'content': content,
        'categoryId': categoryId,
        'description': description,
        'thumbnailUrl': thumbnailUrl,
        'isPremium': isPremium ?? false,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui template.',
        statusCode: response.statusCode,
      );
    }
  }
}
