class Character {
  final String id;
  final String name;
  final String prompt;
  final String? imageUrl;

  Character({
    required this.id,
    required this.name,
    required this.prompt,
    this.imageUrl,
  });

  factory Character.fromJson(Map<String, dynamic> json) {
    return Character(
      id: json['id'] as String,
      name: json['name'] as String,
      prompt: json['prompt'] as String,
      imageUrl: json['imageUrl'] as String?,
    );
  }
}
