import 'settings.dart';

class UserProfile {
  final String id;
  final String name;
  final String email;
  final String? avatarUrl;
  final String role;
  final bool isDemo;
  final bool isActive;
  final String createdAt;
  final String updatedAt;
  final UserSettings? settings;
  final int promptHistoriesCount;
  final int favoritePromptsCount;

  UserProfile({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
    required this.role,
    required this.isDemo,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.settings,
    required this.promptHistoriesCount,
    required this.favoritePromptsCount,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    final count = json['_count'] as Map<String, dynamic>?;
    return UserProfile(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      avatarUrl: json['avatarUrl'] as String?,
      role: json['role'] as String,
      isDemo: json['isDemo'] as bool,
      isActive: json['isActive'] as bool,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      settings: json['settings'] != null
          ? UserSettings.fromJson(json['settings'] as Map<String, dynamic>)
          : null,
      promptHistoriesCount: count?['promptHistories'] as int? ?? 0,
      favoritePromptsCount: count?['favoritePrompts'] as int? ?? 0,
    );
  }
}
