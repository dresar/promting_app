import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:promting_app/data/models/settings.dart';
import 'base_providers.dart';

class SettingsState {
  final UserSettings settings;
  final bool isLoading;

  SettingsState({
    required this.settings,
    this.isLoading = false,
  });

  SettingsState copyWith({
    UserSettings? settings,
    bool? isLoading,
  }) {
    return SettingsState(
      settings: settings ?? this.settings,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  final Ref _ref;
  static const String _themeKey = 'settings_theme';
  static const String _langKey = 'settings_language';
  static const String _notifKey = 'settings_notifications';

  SettingsNotifier(this._ref)
      : super(SettingsState(
          settings: UserSettings(theme: 'SYSTEM'),
        )) {
    _loadLocalSettings();
  }

  Future<void> _loadLocalSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final theme = prefs.getString(_themeKey) ?? 'SYSTEM';

    state = SettingsState(
      settings: UserSettings(theme: theme),
    );
  }

  ThemeMode get themeMode {
    switch (state.settings.theme) {
      case 'LIGHT':
        return ThemeMode.light;
      case 'DARK':
        return ThemeMode.dark;
      default:
        return ThemeMode.system;
    }
  }

  Future<void> updateTheme(String theme) async {
    final newSettings = state.settings.copyWith(theme: theme);
    await _applySettings(newSettings);
  }

  Future<void> _applySettings(UserSettings newSettings) async {
    state = state.copyWith(settings: newSettings, isLoading: true);
    await _saveLocalSettings(newSettings);
    state = state.copyWith(isLoading: false);
  }

  Future<void> _saveLocalSettings(UserSettings settings) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themeKey, settings.theme);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier(ref);
});
