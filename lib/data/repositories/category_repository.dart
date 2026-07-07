import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/core/database/database_service.dart';
import 'package:promting_app/data/models/category.dart';

class CategoryRepository {
  final ApiClient _apiClient;
  final DatabaseService _databaseService;

  CategoryRepository(this._apiClient, this._databaseService);

  Future<List<Category>> getCategories() async {
    // 1. Coba ambil dari remote API dan simpan ke local SQLite
    try {
      final response = await _apiClient.get('/api/categories', requireAuth: false);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        final list = data.map((item) => Category.fromJson(item)).toList();
        
        // Bersihkan tabel lokal lalu masukkan data terbaru
        await _databaseService.execute('DELETE FROM categories');
        for (var cat in list) {
          await _databaseService.execute(
            'INSERT INTO categories (id, name, slug, icon, color) VALUES (\$1, \$2, \$3, \$4, \$5)',
            [cat.id, cat.name, cat.slug, cat.icon, cat.color],
          );
        }
        return list;
      }
    } catch (e) {
      print('Sync categories failed: $e. Membaca dari local database.');
    }

    // 2. Jika offline/gagal, ambil dari local SQLite
    final localData = await _databaseService.execute('SELECT id, name, slug, icon, color FROM categories');
    return localData.map<Category>((row) => Category(
      id: row[0].toString(),
      name: row[1].toString(),
      slug: row[2].toString(),
      icon: row[3]?.toString(),
      color: row[4]?.toString(),
      templatesCount: 0,
    )).toList();
  }

  Future<void> createCategory({required String name, String? icon, String? color}) async {
    final response = await _apiClient.post(
      '/api/categories',
      body: {
        'name': name,
        'icon': icon,
        'color': color,
      },
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal membuat kategori.',
        statusCode: response.statusCode,
      );
    }
  }

  Future<void> deleteCategory(String id) async {
    final response = await _apiClient.delete('/api/categories/$id');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal menghapus kategori.',
        statusCode: response.statusCode,
      );
    }
  }
}
