import 'prompt_history.dart';

class FavoritePrompt {
  final String id;
  final String userId;
  final String promptHistoryId;
  final String createdAt;
  final PromptHistory promptHistory;

  FavoritePrompt({
    required this.id,
    required this.userId,
    required this.promptHistoryId,
    required this.createdAt,
    required this.promptHistory,
  });

  factory FavoritePrompt.fromJson(Map<String, dynamic> json) {
    return FavoritePrompt(
      id: json['id'] as String,
      userId: json['userId'] as String,
      promptHistoryId: json['promptHistoryId'] as String,
      createdAt: json['createdAt'] as String,
      promptHistory: PromptHistory.fromJson({
        ...(json['promptHistory'] as Map<String, dynamic>),
        'favoritePrompt': {'id': json['id']}
      }),
    );
  }
}
