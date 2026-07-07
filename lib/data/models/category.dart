class Category {
  final String id;
  final String name;
  final String slug;
  final String? icon;
  final String? color;
  final int templatesCount;

  Category({
    required this.id,
    required this.name,
    required this.slug,
    this.icon,
    this.color,
    required this.templatesCount,
  });

  factory Category.fromJson(Map<String, dynamic> json) {
    final count = json['_count'] as Map<String, dynamic>?;
    return Category(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      icon: json['icon'] as String?,
      color: json['color'] as String?,
      templatesCount: count?['templates'] as int? ?? 0,
    );
  }
}
