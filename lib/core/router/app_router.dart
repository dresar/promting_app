import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/screens/common/splash_screen.dart';
import 'package:promting_app/screens/common/error_screen.dart';
import 'package:promting_app/screens/common/about_screen.dart';
import 'package:promting_app/screens/dashboard/dashboard_shell.dart';
import 'package:promting_app/screens/prompt/prompt_generator_screen.dart';
import 'package:promting_app/screens/prompt/prompt_detail_screen.dart';
import 'package:promting_app/screens/prompt/prompt_selection_screen.dart';
import 'package:promting_app/screens/prompt/ad_prompt_generator_screen.dart';
import 'package:promting_app/screens/prompt/banner_prompt_generator_screen.dart';
import 'package:promting_app/screens/prompt/logo_prompt_generator_screen.dart';
import 'package:promting_app/screens/prompt/quote_prompt_generator_screen.dart';
import 'package:promting_app/screens/prompt/digital_product_generator_screen.dart';
import 'package:promting_app/screens/template/template_detail_screen.dart';
import 'package:promting_app/screens/settings/settings_screen.dart';
import 'package:promting_app/screens/settings/admin_browser_screen.dart';
import 'package:promting_app/screens/favorite/favorite_screen.dart';

import 'package:promting_app/screens/auth/login_screen.dart';
import 'package:promting_app/providers/auth_provider.dart';
import 'package:promting_app/providers/base_providers.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final router = GoRouter(
    initialLocation: '/splash',
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      
      final isSplash = state.uri.path == '/splash';
      final isLogin = state.uri.path == '/login';
      final isLoading = authState.status == AuthStatus.initial || authState.status == AuthStatus.loading;
      final isUnauthenticated = authState.status == AuthStatus.unauthenticated || authState.status == AuthStatus.error;
      final isAuthenticated = authState.status == AuthStatus.authenticated;

      if (isLoading) {
        if (isLogin) return null;
        return '/splash';
      }

      if (isUnauthenticated && !isLogin) {
        return '/login';
      }

      if (isAuthenticated && (isSplash || isLogin)) {
        final lastLoc = authState.lastLocation;
        if (lastLoc != null && lastLoc.isNotEmpty && lastLoc != '/' && lastLoc != '/splash' && lastLoc != '/login') {
          return lastLoc;
        }
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/splash',
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/',
        builder: (context, state) => const DashboardShell(),
      ),
      GoRoute(
        path: '/generate',
        builder: (context, state) => const PromptSelectionScreen(),
      ),
      GoRoute(
        path: '/generate-edu',
        builder: (context, state) => const PromptGeneratorScreen(),
      ),
      GoRoute(
        path: '/generate-ad',
        builder: (context, state) => const AdPromptGeneratorScreen(),
      ),
      GoRoute(
        path: '/generate-banner',
        builder: (context, state) => const BannerPromptGeneratorScreen(),
      ),
      GoRoute(
        path: '/generate-logo',
        builder: (context, state) => const LogoPromptGeneratorScreen(),
      ),
      GoRoute(
        path: '/generate-quote',
        builder: (context, state) => const QuotePromptGeneratorScreen(),
      ),
      GoRoute(
        path: '/generate-digital-product',
        builder: (context, state) => const DigitalProductGeneratorScreen(),
      ),
      GoRoute(
        path: '/prompt/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return PromptDetailScreen(id: id);
        },
      ),
      GoRoute(
        path: '/template/:id',
        builder: (context, state) {
          final id = state.pathParameters['id'] ?? '';
          return TemplateDetailScreen(id: id);
        },
      ),
      GoRoute(
        path: '/settings',
        builder: (context, state) => const SettingsScreen(),
      ),
      GoRoute(
        path: '/favorites',
        builder: (context, state) => const FavoriteScreen(),
      ),
      GoRoute(
        path: '/about',
        builder: (context, state) => const AboutScreen(),
      ),
      GoRoute(
        path: '/admin-browser',
        builder: (context, state) {
          final url = state.uri.queryParameters['url'] ?? '';
          return AdminBrowserScreen(url: url);
        },
      ),
    ],
    errorBuilder: (context, state) => ErrorScreen(
      errorMessage: state.error?.toString(),
    ),
  );

  router.routerDelegate.addListener(() {
    final location = router.routerDelegate.currentConfiguration.uri.toString();
    if (location != '/splash' && location != '/login') {
      ref.read(secureStorageProvider).write('last_location', location);
    }
  });

  ref.listen(authProvider, (previous, next) {
    router.refresh();
  });

  return router;
});
