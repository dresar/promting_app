import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/core/database/database_service.dart';
import 'package:promting_app/core/config/app_config_service.dart';
import 'package:promting_app/core/services/auth_service.dart';

import 'package:promting_app/core/services/api_client.dart';
import 'package:promting_app/data/services/secure_storage_service.dart';
import 'package:promting_app/data/repositories/auth_repository.dart';
import 'package:promting_app/data/repositories/user_repository.dart';
import 'package:promting_app/data/repositories/category_repository.dart';
import 'package:promting_app/data/repositories/template_repository.dart';
import 'package:promting_app/data/repositories/prompt_repository.dart';
import 'package:promting_app/data/repositories/settings_repository.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';

// ─── Singleton Core Services ───────────────────────────────────────────────

/// Koneksi langsung ke Neon PostgreSQL
final databaseServiceProvider = Provider<DatabaseService>((ref) {
  return DatabaseService.instance;
});

/// Konfigurasi app (JWT secrets dll) dari tabel app_config di Neon
final appConfigServiceProvider = Provider<AppConfigService>((ref) {
  return AppConfigService.instance;
});

/// Auth service: JWT sign/verify + BCrypt hash/check
final authServiceProvider = Provider<AuthService>((ref) {
  return AuthService.instance;
});


// ─── Secure Storage ────────────────────────────────────────────────────────

final secureStorageProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

// ─── API Client ────────────────────────────────────────────────────────────

final apiClientProvider = Provider<ApiClient>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  return ApiClient(secureStorage);
});

// ─── Repositories ──────────────────────────────────────────────────────────

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  final apiClient = ref.watch(apiClientProvider);
  return AuthRepository(secureStorage, apiClient);
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  final apiClient = ref.watch(apiClientProvider);
  return UserRepository(secureStorage, apiClient);
});

final categoryRepositoryProvider = Provider<CategoryRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final databaseService = ref.watch(databaseServiceProvider);
  return CategoryRepository(apiClient, databaseService);
});

final templateRepositoryProvider = Provider<TemplateRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return TemplateRepository(apiClient);
});

final promptRepositoryProvider = Provider<PromptRepository>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  final apiClient = ref.watch(apiClientProvider);
  return PromptRepository(secureStorage, apiClient);
});

final settingsRepositoryProvider = Provider<SettingsRepository>((ref) {
  final secureStorage = ref.watch(secureStorageProvider);
  final apiClient = ref.watch(apiClientProvider);
  return SettingsRepository(secureStorage, apiClient);
});

final appOptionsRepositoryProvider = Provider<AppOptionsRepository>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final databaseService = ref.watch(databaseServiceProvider);
  return AppOptionsRepository(apiClient, databaseService);
});
