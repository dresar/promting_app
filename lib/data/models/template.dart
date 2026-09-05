import 'category.dart';

class Template {
  final String id;
  final String title;
  final String? description;
  final String content;
  final String? thumbnailUrl;
  final String categoryId;
  final bool isPremium;
  final int usageCount;
  final String createdAt;
  final String updatedAt;
  final Category? category;

  Template({
    required this.id,
    required this.title,
    this.description,
    required this.content,
    this.thumbnailUrl,
    required this.categoryId,
    required this.isPremium,
    required this.usageCount,
    required this.createdAt,
    required this.updatedAt,
    this.category,
  });

  factory Template.fromJson(Map<String, dynamic> json) {
    return Template(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      content: json['content'] as String,
      thumbnailUrl: json['thumbnailUrl'] as String?,
      categoryId: json['categoryId'] as String,
      isPremium: json['isPremium'] as bool? ?? false,
      usageCount: json['usageCount'] as int? ?? 0,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      category: json['category'] != null
          ? Category.fromJson(json['category'] as Map<String, dynamic>)
          : null,
    );
  }
}
