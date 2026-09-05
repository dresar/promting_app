import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/data/models/user_profile.dart';
import 'base_providers.dart';

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthState {
  final AuthStatus status;
  final UserProfile? user;
  final String? errorMessage;
  final String? lastLocation;

  AuthState({
    required this.status,
    this.user,
    this.errorMessage,
    this.lastLocation,
  });

  factory AuthState.initial() => AuthState(status: AuthStatus.initial);
  factory AuthState.loading() => AuthState(status: AuthStatus.loading);
  factory AuthState.authenticated(UserProfile user, {String? lastLocation}) =>
      AuthState(status: AuthStatus.authenticated, user: user, lastLocation: lastLocation);
  factory AuthState.unauthenticated() => AuthState(status: AuthStatus.unauthenticated);
  factory AuthState.error(String message) => AuthState(status: AuthStatus.error, errorMessage: message);
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(AuthState.initial()) {
    checkAutoLogin();
  }

  Future<void> checkAutoLogin() async {
    state = AuthState.loading();
    try {
      final token = await _ref.read(secureStorageProvider).getAccessToken();
      if (token == null || token.isEmpty) {
        state = AuthState.unauthenticated();
        return;
      }

      // Check login timestamp for 3-day expiration limit
      final loginTimeStr = await _ref.read(secureStorageProvider).read('login_timestamp');
      if (loginTimeStr != null && loginTimeStr.isNotEmpty) {
        final loginTimeMs = int.tryParse(loginTimeStr);
        if (loginTimeMs != null) {
          final loginTime = DateTime.fromMillisecondsSinceEpoch(loginTimeMs);
          final diff = DateTime.now().difference(loginTime);
          if (diff.inDays >= 3) {
            print('Session expired (3 days limit reached). Auto logging out.');
            await logout();
            return;
          }
        }
      } else {
        // If token exists but no timestamp, set it to now to avoid instant logout
        await _ref.read(secureStorageProvider).write('login_timestamp', DateTime.now().millisecondsSinceEpoch.toString());
      }

      final lastLoc = await _ref.read(secureStorageProvider).read('last_location');
      final profile = await _ref.read(userRepositoryProvider).getProfile();
      state = AuthState.authenticated(profile, lastLocation: lastLoc);
    } catch (e) {
      print('Auto login error: $e');
      state = AuthState.unauthenticated();
    }
  }

  Future<void> login(String email, String password) async {
    state = AuthState.loading();
    try {
      final profile = await _ref.read(userRepositoryProvider).login(email, password);
      // Write current time as login timestamp
      await _ref.read(secureStorageProvider).write('login_timestamp', DateTime.now().millisecondsSinceEpoch.toString());
      state = AuthState.authenticated(profile);
    } catch (e) {
      state = AuthState.error(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> register(String name, String email, String password) async {
    state = AuthState.loading();
    try {
      await _ref.read(authRepositoryProvider).register(name, email, password);
      final profile = await _ref.read(userRepositoryProvider).getProfile();
      // Write current time as login timestamp
      await _ref.read(secureStorageProvider).write('login_timestamp', DateTime.now().millisecondsSinceEpoch.toString());
      state = AuthState.authenticated(profile);
    } catch (e) {
      state = AuthState.error(e.toString().replaceAll('Exception: ', ''));
    }
  }

  Future<void> logout() async {
    state = AuthState.loading();
    try {
      await _ref.read(secureStorageProvider).delete('login_timestamp');
      await _ref.read(secureStorageProvider).delete('last_location');
      await _ref.read(authRepositoryProvider).logout();
      state = AuthState.unauthenticated();
    } catch (e) {
      state = AuthState.unauthenticated();
    }
  }

  void updateLocalProfile(UserProfile updatedProfile) {
    if (state.status == AuthStatus.authenticated) {
      state = AuthState.authenticated(updatedProfile, lastLocation: state.lastLocation);
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});
