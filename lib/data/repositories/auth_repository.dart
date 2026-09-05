import 'dart:convert';
import 'package:promting_app/core/errors/exceptions.dart';
import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/models/auth_response.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';

class AuthRepository {
  final SecureStorageService _secureStorage;
  final ApiClient _apiClient;

  AuthRepository(this._secureStorage, this._apiClient);

  // ─── Register ──────────────────────────────────────────────────────────────

  Future<AuthResponse> register(String name, String email, String password) async {
    final response = await _apiClient.post(
      '/api/auth/register',
      body: {
        'name': name,
        'email': email,
        'password': password,
      },
      requireAuth: false,
    );

    if (response.statusCode != 201) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Gagal mendaftar.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final authResponse = AuthResponse.fromJson(data);
    await _saveSession(authResponse);
    return authResponse;
  }

  // ─── Login ─────────────────────────────────────────────────────────────────

  Future<AuthResponse> login(String email, String password) async {
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
    final authResponse = AuthResponse.fromJson(data);
    await _saveSession(authResponse);
    return authResponse;
  }

  // ─── Demo Login ────────────────────────────────────────────────────────────

  Future<AuthResponse> demoLogin() async {
    final response = await _apiClient.post(
      '/api/auth/demo',
      body: {},
      requireAuth: false,
    );

    if (response.statusCode != 200) {
      final errorData = jsonDecode(response.body);
      throw ApiException(
        message: errorData['message'] ?? 'Demo account tidak tersedia.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final authResponse = AuthResponse.fromJson(data);
    await _saveSession(authResponse);
    return authResponse;
  }

  // ─── Refresh Token ─────────────────────────────────────────────────────────

  Future<String> refreshAccessToken(String refreshToken) async {
    final response = await _apiClient.post(
      '/api/auth/refresh',
      body: {'refreshToken': refreshToken},
      requireAuth: false,
    );

    if (response.statusCode != 200) {
      throw ApiException(
        message: 'Refresh token tidak valid.',
        statusCode: response.statusCode,
      );
    }

    final data = jsonDecode(response.body);
    final newAccessToken = data['accessToken'] as String;
    await _secureStorage.saveAccessToken(newAccessToken);
    return newAccessToken;
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

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

  // ─── Helpers ───────────────────────────────────────────────────────────────

  Future<void> _saveSession(AuthResponse authResponse) async {
    await _secureStorage.saveAccessToken(authResponse.accessToken);
    await _secureStorage.saveRefreshToken(authResponse.refreshToken);
    await _secureStorage.write('userId', authResponse.user.id);
  }
}
