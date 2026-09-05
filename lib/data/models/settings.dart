class UserSettings {
  final String theme;

  UserSettings({
    required this.theme,
  });

  factory UserSettings.fromJson(Map<String, dynamic> json) {
    return UserSettings(
      theme: json['theme'] as String? ?? 'SYSTEM',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'theme': theme,
    };
  }

  UserSettings copyWith({
    String? theme,
  }) {
    return UserSettings(
      theme: theme ?? this.theme,
    );
  }
}
