# 🎨 Dokumentasi Frontend (Flutter)

<div align="center">

![Frontend](https://img.shields.io/badge/Frontend-Flutter_Docs-blue?style=for-the-badge)

**Dokumentasi lengkap Frontend Flutter PromptStudio AI**

</div>

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Arsitektur Frontend](#-arsitektur-frontend)
3. [Struktur Folder](#-struktur-folder)
4. [State Management](#-state-management)
5. [Routing & Navigation](#-routing--navigation)
6. [UI Components](#-ui-components)
7. [Theming](#-theming)
8. [API Integration](#-api-integration)
9. [Build & Deployment](#-build--deployment)

---

## 🌐 Overview

Frontend PromptStudio AI dibangun menggunakan **Flutter** dengan arsitektur modern yang scalable dan maintainable. Aplikasi mendukung multi-platform: Android, iOS, Web, Windows, macOS, dan Linux.

### Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Framework** | Flutter 3.12.2 | Cross-platform UI |
| **Language** | Dart 3.12.2 | Programming language |
| **State Mgmt** | Riverpod 2.5.1 | State management |
| **Routing** | GoRouter 14.2.0 | Declarative routing |
| **Storage** | SQLite + SharedPreferences | Local data |
| **HTTP** | Dio 5.10.0 | API client |
| **Auth** | flutter_secure_storage | Secure token storage |
| **UI** | Material 3 | Modern design system |

### Supported Platforms

✅ Android  
✅ iOS  
✅ Web  
✅ Windows  
✅ macOS  
✅ Linux  

---

## 🏗️ Arsitektur Frontend

Aplikasi menggunakan arsitektur **Feature-First** dengan pemisahan concern yang jelas:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Screens, Widgets, Themes)       │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│      (Providers, Controllers)       │
├─────────────────────────────────────┤
│           Data Layer                │
│  (Repositories, Models, Services)   │
└─────────────────────────────────────┘
```

---

## 📂 Struktur Folder

```
lib/
├── main.dart                     # App entry point
├── core/                         # Core utilities
│   ├── constants/               # App constants
│   │   ├── api_constants.dart   # API endpoints
│   │   ├── app_constants.dart   # App config
│   │   └── theme_colors.dart    # Color palette
│   ├── router/                  # Routing configuration
│   │   └── app_router.dart      # GoRouter setup
│   └── theme/                   # Theme configuration
│       └── app_theme.dart       # Light/Dark themes
├── data/                        # Data layer
│   ├── models/                  # Data models
│   │   ├── user_model.dart
│   │   ├── prompt_model.dart
│   │   ├── template_model.dart
│   │   └── category_model.dart
│   ├── repositories/            # Data repositories
│   │   ├── auth_repository.dart
│   │   ├── prompt_repository.dart
│   │   └── template_repository.dart
│   └── services/                # External services
│       ├── api_service.dart     # HTTP client
│       └── storage_service.dart # Local storage
├── providers/                   # Riverpod providers
│   ├── auth_provider.dart       # Auth state
│   ├── prompt_provider.dart     # Prompts state
│   ├── template_provider.dart   # Templates state
│   └── settings_provider.dart   # App settings
├── screens/                     # UI screens
│   ├── auth/                    # Authentication
│   │   ├── login_screen.dart
│   │   └── register_screen.dart
│   ├── dashboard/               # Dashboard
│   │   └── dashboard_screen.dart
│   ├── prompt/                  # Prompt management
│   │   ├── prompt_list_screen.dart
│   │   ├── prompt_detail_screen.dart
│   │   └── prompt_form_screen.dart
│   ├── template/                # Template management
│   │   ├── template_list_screen.dart
│   │   └── template_form_screen.dart
│   ├── favorite/                # Favorites
│   │   └── favorite_screen.dart
│   └── settings/                # Settings
│       └── settings_screen.dart
└── widgets/                     # Reusable widgets
    ├── common/                  # Common widgets
    │   ├── app_button.dart
    │   ├── app_textfield.dart
    │   └── loading_indicator.dart
    ├── prompt/                  # Prompt widgets
    │   ├── prompt_card.dart
    │   └── prompt_tile.dart
    └── template/                # Template widgets
        └── template_card.dart
```

---

## 🔄 State Management

### Riverpod Setup

Aplikasi menggunakan **Riverpod** untuk state management dengan pola Provider.

#### Contoh Provider

```dart
// providers/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/repositories/auth_repository.dart';
import '../data/models/user_model.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

final authStateProvider = StateNotifierProvider<AuthNotifier, AsyncValue<User?>>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});

class AuthNotifier extends StateNotifier<AsyncValue<User?>> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final user = await _repository.login(email, password);
      state = AsyncValue.data(user);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }

  Future<void> logout() async {
    await _repository.logout();
    state = const AsyncValue.data(null);
  }
}
```

#### Menggunakan Provider di Screen

```dart
// screens/dashboard/dashboard_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/prompt_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateProvider);
    final promptsState = ref.watch(promptsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(authStateProvider.notifier).logout(),
          ),
        ],
      ),
      body: authState.when(
        data: (user) {
          if (user == null) {
            return const Center(child: Text('Please login'));
          }
          return promptsState.when(
            data: (prompts) => ListView.builder(
              itemCount: prompts.length,
              itemBuilder: (context, index) {
                final prompt = prompts[index];
                return ListTile(
                  title: Text(prompt.title),
                  subtitle: Text(prompt.description),
                );
              },
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (error, stack) => Center(child: Text('Error: $error')),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
      ),
    );
  }
}
```

---

## 🧭 Routing & Navigation

### GoRouter Configuration

```dart
// core/router/app_router.dart
import 'package:go_router/go_router.dart';
import '../../screens/auth/login_screen.dart';
import '../../screens/auth/register_screen.dart';
import '../../screens/dashboard/dashboard_screen.dart';
import '../../screens/prompt/prompt_list_screen.dart';
import '../../screens/prompt/prompt_detail_screen.dart';
import '../../screens/template/template_list_screen.dart';
import '../../screens/favorite/favorite_screen.dart';
import '../../screens/settings/settings_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/login',
    routes: [
      // Auth routes
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Main app routes
      GoRoute(
        path: '/',
        name: 'dashboard',
        builder: (context, state) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/prompts',
        name: 'prompts',
        builder: (context, state) => const PromptListScreen(),
      ),
      GoRoute(
        path: '/prompts/:id',
        name: 'prompt-detail',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return PromptDetailScreen(promptId: id);
        },
      ),
      GoRoute(
        path: '/templates',
        name: 'templates',
        builder: (context, state) => const TemplateListScreen(),
      ),
      GoRoute(
        path: '/favorites',
        name: 'favorites',
        builder: (context, state) => const FavoriteScreen(),
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (context, state) => const SettingsScreen(),
      ),
    ],
  );
});
```

### Navigasi

```dart
// Named navigation
context.goNamed('login');
context.goNamed('dashboard');
context.goNamed('prompt-detail', pathParameters: {'id': '123'});

// With query parameters
context.go('/prompts', extra: {'category': 'writing'});

// Back navigation
context.pop();
```

---

## 🎨 UI Components

### Common Widgets

#### App Button

```dart
// widgets/common/app_button.dart
import 'package:flutter/material.dart';

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isOutlined;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isOutlined = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isOutlined) {
      return OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        child: isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
            : Text(text),
      );
    }

    return FilledButton(
      onPressed: isLoading ? null : onPressed,
      child: isLoading
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            )
          : Text(text),
    );
  }
}
```

#### App TextField

```dart
// widgets/common/app_textfield.dart
import 'package:flutter/material.dart';

class AppTextField extends StatelessWidget {
  final String label;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final bool obscureText;
  final String? Function(String?)? validator;
  final Widget? prefixIcon;
  final Widget? suffixIcon;

  const AppTextField({
    super.key,
    required this.label,
    this.controller,
    this.keyboardType,
    this.obscureText = false,
    this.validator,
    this.prefixIcon,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: prefixIcon,
        suffixIcon: suffixIcon,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    );
  }
}
```

### Custom Components

#### Prompt Card

```dart
// widgets/prompt/prompt_card.dart
import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../data/models/prompt_model.dart';

class PromptCard extends StatelessWidget {
  final Prompt prompt;
  final VoidCallback onTap;
  final VoidCallback? onFavorite;

  const PromptCard({
    super.key,
    required this.prompt,
    required this.onTap,
    this.onFavorite,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (prompt.imageUrl != null)
              CachedNetworkImage(
                imageUrl: prompt.imageUrl!,
                height: 120,
                width: double.infinity,
                fit: BoxFit.cover,
                placeholder: (context, url) => Container(
                  height: 120,
                  color: Colors.grey[300],
                  child: const Center(child: CircularProgressIndicator()),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          prompt.title,
                          style: Theme.of(context).textTheme.titleMedium,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          prompt.isFavorite
                              ? Icons.favorite
                              : Icons.favorite_border,
                          color: prompt.isFavorite ? Colors.red : null,
                        ),
                        onPressed: onFavorite,
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    prompt.description,
                    style: Theme.of(context).textTheme.bodySmall,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 4,
                    runSpacing: 4,
                    children: prompt.tags
                        .take(3)
                        .map((tag) => Chip(
                              label: Text(
                                tag,
                                style: const TextStyle(fontSize: 10),
                              ),
                              padding: EdgeInsets.zero,
                              visualDensity: VisualDensity.compact,
                            ))
                        .toList(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 🎨 Theming

### Theme Configuration

```dart
// core/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/theme_colors.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: ThemeColors.primary,
        secondary: ThemeColors.secondary,
        surface: ThemeColors.surfaceLight,
        background: ThemeColors.backgroundLight,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(),
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: ThemeColors.primary,
        secondary: ThemeColors.secondary,
        surface: ThemeColors.surfaceDark,
        background: ThemeColors.backgroundDark,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        ThemeData.dark().textTheme,
      ),
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      cardTheme: CardTheme(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 16,
        ),
      ),
    );
  }
}
```

### Color Palette

```dart
// core/constants/theme_colors.dart
import 'package:flutter/material.dart';

class ThemeColors {
  // Primary colors
  static const Color primary = Color(0xFF6366F1);
  static const Color secondary = Color(0xFF10B981);
  
  // Dark theme
  static const Color backgroundDark = Color(0xFF0B0C10);
  static const Color surfaceDark = Color(0xFF161A25);
  
  // Light theme
  static const Color backgroundLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  
  // Accent colors
  static const Color accent = Color(0xFF8B5CF6);
  static const Color error = Color(0xFFEF4444);
  static const Color warning = Color(0xFFF59E0B);
  static const Color success = Color(0xFF10B981);
}
```

### Switch Theme

```dart
// providers/settings_provider.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum ThemeModeOption { light, dark, system }

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier();
});

class SettingsState {
  final ThemeModeOption themeModeOption;
  
  ThemeMode get themeMode {
    switch (themeModeOption) {
      case ThemeModeOption.light:
        return ThemeMode.light;
      case ThemeModeOption.dark:
        return ThemeMode.dark;
      case ThemeModeOption.system:
        return ThemeMode.system;
    }
  }
  
  SettingsState({this.themeModeOption = ThemeModeOption.system});
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(SettingsState()) {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final mode = prefs.getString('theme_mode') ?? 'system';
    state = SettingsState(
      themeModeOption: ThemeModeOption.values.firstWhere(
        (e) => e.name == mode,
        orElse: () => ThemeModeOption.system,
      ),
    );
  }

  Future<void> setThemeMode(ThemeModeOption mode) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('theme_mode', mode.name);
    state = SettingsState(themeModeOption: mode);
  }
}
```

---

## 🌐 API Integration

### API Service

```dart
// data/services/api_service.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/constants/api_constants.dart';

class ApiService {
  final Dio _dio;
  final FlutterSecureStorage _storage;

  ApiService()
      : _dio = Dio(BaseOptions(
          baseUrl: ApiConstants.baseUrl,
          connectTimeout: const Duration(seconds: 30),
          receiveTimeout: const Duration(seconds: 30),
        )),
        _storage = const FlutterSecureStorage() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Handle unauthorized
        }
        return handler.next(error);
      },
    ));
  }

  Future<Response<T>> get<T>(String path, {Map<String, dynamic>? queryParameters}) {
    return _dio.get<T>(path, queryParameters: queryParameters);
  }

  Future<Response<T>> post<T>(String path, {dynamic data}) {
    return _dio.post<T>(path, data: data);
  }

  Future<Response<T>> put<T>(String path, {dynamic data}) {
    return _dio.put<T>(path, data: data);
  }

  Future<Response<T>> delete<T>(String path) {
    return _dio.delete<T>(path);
  }
}
```

### Repository Pattern

```dart
// data/repositories/prompt_repository.dart
import '../models/prompt_model.dart';
import '../services/api_service.dart';

class PromptRepository {
  final ApiService _apiService;

  PromptRepository(this._apiService);

  Future<List<Prompt>> getPrompts({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
  }) async {
    final response = await _apiService.get('/prompts', queryParameters: {
      'page': page,
      'limit': limit,
      if (category != null) 'category': category,
      if (search != null) 'search': search,
    });

    final data = response.data as Map<String, dynamic>;
    final promptsJson = data['prompts'] as List;
    return promptsJson.map((json) => Prompt.fromJson(json)).toList();
  }

  Future<Prompt> getPromptById(String id) async {
    final response = await _apiService.get('/prompts/$id');
    return Prompt.fromJson(response.data['data']);
  }

  Future<Prompt> createPrompt(Prompt prompt) async {
    final response = await _apiService.post('/prompts', data: prompt.toJson());
    return Prompt.fromJson(response.data['data']);
  }

  Future<void> deletePrompt(String id) async {
    await _apiService.delete('/prompts/$id');
  }
}
```

---

## 📦 Build & Deployment

### Android

```bash
# Build APK
flutter build apk --release

# Build App Bundle (for Play Store)
flutter build appbundle --release

# Specific ABI
flutter build apk --split-per-abi
```

### iOS

```bash
# Build for iOS
flutter build ios --release

# Archive for App Store
# Open in Xcode and archive from there
```

### Web

```bash
# Build for web
flutter build web --release

# With custom base href
flutter build web --base-href /promting_app/
```

### Desktop

```bash
# Windows
flutter build windows --release

# macOS
flutter build macos --release

# Linux
flutter build linux --release
```

### Version Management

Update version in `pubspec.yaml`:

```yaml
version: 1.0.0+1  # version+build_number
```

---

## 📞 Support

Butuh bantuan dengan frontend?

- 📧 GitHub Issues: [Report Issue](https://github.com/dresar/promting_app/issues)
- 📚 Documentation: [README.md](../README.md)
- 💬 Discussions: [GitHub Discussions](https://github.com/dresar/promting_app/discussions)

---

<div align="center">

**PromptStudio AI Frontend** 

Built with ❤️ using Flutter & Dart

[⬆ Back to Top](#-daftar-isi)

</div>
