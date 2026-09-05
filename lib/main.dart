import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/core/constants/theme.dart';
import 'package:promting_app/core/router/app_router.dart';
import 'package:promting_app/providers/settings_provider.dart';

void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    ref.watch(settingsProvider); // trigger rebuild on theme change
    final settingsNotifier = ref.read(settingsProvider.notifier);

    return MaterialApp.router(
      title: 'PromptStudio AI',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: settingsNotifier.themeMode,
      routerConfig: router,
    );
  }
}
