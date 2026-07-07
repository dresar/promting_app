import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:promting_app/screens/dashboard/home_screen.dart';
import 'package:promting_app/screens/dashboard/templates_screen.dart';
import 'package:promting_app/screens/dashboard/history_screen.dart';
import 'package:promting_app/screens/settings/settings_screen.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/providers/dashboard_provider.dart';
import 'package:promting_app/screens/prompt/prompt_selection_screen.dart';

class DashboardShell extends ConsumerWidget {
  const DashboardShell({super.key});

  static const _platform = MethodChannel('com.example.promting_app/app');

  Future<bool> _minimizeApp() async {
    try {
      await _platform.invokeMethod('minimize');
      return false; // Prevent default pop
    } on PlatformException catch (e) {
      debugPrint("Failed to minimize app: '${e.message}'.");
      return true; // Fallback to default pop
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final currentIndex = ref.watch(dashboardTabIndexProvider);

    final List<Widget> screens = const [
      HomeScreen(),
      TemplatesScreen(),
      PromptSelectionScreen(),
      HistoryScreen(),
      SettingsScreen(),
    ];

    return WillPopScope(
      onWillPop: _minimizeApp,
      child: Scaffold(
        body: IndexedStack(
          index: currentIndex,
          children: screens,
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(20),
              topRight: Radius.circular(20),
            ),
            child: BottomNavigationBar(
              currentIndex: currentIndex,
              onTap: (index) {
                ref.read(dashboardTabIndexProvider.notifier).state = index;
              },
              type: BottomNavigationBarType.fixed,
              backgroundColor: theme.colorScheme.surface,
              selectedItemColor: theme.colorScheme.primary,
              unselectedItemColor: theme.colorScheme.onSurface.withValues(alpha: 0.4),
              selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11),
              unselectedLabelStyle: const TextStyle(fontSize: 11),
              items: const [
                BottomNavigationBarItem(
                  icon: Icon(Icons.home_outlined),
                  activeIcon: Icon(Icons.home_rounded),
                  label: 'Beranda',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.dashboard_customize_outlined),
                  activeIcon: Icon(Icons.dashboard_customize_rounded),
                  label: 'Template',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.add_circle_outline),
                  activeIcon: Icon(Icons.add_circle),
                  label: 'Buat Prompt',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.history_outlined),
                  activeIcon: Icon(Icons.history_rounded),
                  label: 'Riwayat',
                ),
                BottomNavigationBarItem(
                  icon: Icon(Icons.settings_outlined),
                  activeIcon: Icon(Icons.settings_rounded),
                  label: 'Pengaturan',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
