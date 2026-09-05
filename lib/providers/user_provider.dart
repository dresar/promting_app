import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'auth_provider.dart';
import 'base_providers.dart';

class UserState {
  final bool isLoading;
  final String? errorMessage;
  final String? successMessage;

  UserState({
    this.isLoading = false,
    this.errorMessage,
    this.successMessage,
  });

  UserState copyWith({
    bool? isLoading,
    String? errorMessage,
    String? successMessage,
  }) {
    return UserState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      successMessage: successMessage,
    );
  }
}

class UserNotifier extends StateNotifier<UserState> {
  final Ref _ref;

  UserNotifier(this._ref) : super(UserState());

  Future<void> updateProfile(String name, String? avatarUrl) async {
    state = UserState(isLoading: true);
    try {
      final updated = await _ref.read(userRepositoryProvider).updateProfile(name, avatarUrl);
      _ref.read(authProvider.notifier).updateLocalProfile(updated);
      state = UserState(successMessage: 'Profil berhasil diperbarui.');
    } catch (e) {
      state = UserState(errorMessage: e.toString());
    }
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    state = UserState(isLoading: true);
    try {
      await _ref.read(userRepositoryProvider).changePassword(currentPassword, newPassword);
      state = UserState(successMessage: 'Kata sandi berhasil diubah.');
    } catch (e) {
      state = UserState(errorMessage: e.toString());
    }
  }



  Future<void> refreshProfile() async {
    try {
      final profile = await _ref.read(userRepositoryProvider).getProfile();
      _ref.read(authProvider.notifier).updateLocalProfile(profile);
    } catch (_) {}
  }
}

final userProvider = StateNotifierProvider<UserNotifier, UserState>((ref) {
  return UserNotifier(ref);
});
