import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/models/user_profile.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';

class UserRepository {
  final SecureStorageService _secureStorage;
  final ApiClient _apiClient;

  UserRepository(this._secureStorage, this._apiClient);

  Future<UserProfile> login(String email, String password) async {
    final response = await _apiClient.post(
      '/api/auth/login',
      body: {
        'email': email,
        'password': password,
      },
      requireAuth: false,
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Email atau password salah.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    await _secureStorage.saveAccessToken(data['accessToken'] as String);
    await _secureStorage.saveRefreshToken(data['refreshToken'] as String);
    await _secureStorage.write('userId', data['user']['id'] as String);

    return getProfile();
  }

  Future<void> logout() async {
    final refreshToken = await _secureStorage.getRefreshToken();
    if (refreshToken != null && refreshToken.isNotEmpty) {
      try {
        await _apiClient.post(
          '/api/auth/logout',
          body: {'refreshToken': refreshToken},
          requireAuth: false,
        );
      } catch (_) {}
    }
    await _secureStorage.clearAll();
  }

  Future<UserProfile> getProfile() async {
    final response = await _apiClient.get('/api/user/profile');
    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengambil profil.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return UserProfile.fromJson(data);
  }

  Future<UserProfile> updateProfile(String name, String? avatarUrl) async {
    final response = await _apiClient.put(
      '/api/user/profile',
      body: {
        'name': name,
        'avatarUrl': avatarUrl,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal memperbarui profil.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    return UserProfile.fromJson(data);
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    final response = await _apiClient.put(
      '/api/user/change-password',
      body: {
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      },
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mengubah kata sandi.',
        statusCode: response.statusCode,
      );
    }
  }


}
