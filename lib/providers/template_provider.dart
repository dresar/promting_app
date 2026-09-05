import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/data/models/template.dart';
import 'base_providers.dart';

class TemplateState {
  final List<Template> templates;
  final bool isLoading;
  final bool isLoadingMore;
  final String? errorMessage;
  final int page;
  final int totalPages;
  final String searchQuery;
  final String? selectedCategoryId;

  TemplateState({
    required this.templates,
    this.isLoading = false,
    this.isLoadingMore = false,
    this.errorMessage,
    this.page = 1,
    this.totalPages = 1,
    this.searchQuery = '',
    this.selectedCategoryId,
  });

  factory TemplateState.initial() => TemplateState(templates: []);

  TemplateState copyWith({
    List<Template>? templates,
    bool? isLoading,
    bool? isLoadingMore,
    String? errorMessage,
    int? page,
    int? totalPages,
    String? searchQuery,
    String? selectedCategoryId,
  }) {
    return TemplateState(
      templates: templates ?? this.templates,
      isLoading: isLoading ?? this.isLoading,
      isLoadingMore: isLoadingMore ?? this.isLoadingMore,
      errorMessage: errorMessage,
      page: page ?? this.page,
      totalPages: totalPages ?? this.totalPages,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategoryId: selectedCategoryId ?? this.selectedCategoryId,
    );
  }
}

class TemplateNotifier extends StateNotifier<TemplateState> {
  final Ref _ref;

  TemplateNotifier(this._ref) : super(TemplateState.initial());

  Future<void> fetchTemplates({
    String? categoryId,
    String query = '',
    bool reset = true,
  }) async {
    if (reset) {
      state = state.copyWith(
        isLoading: true,
        templates: [],
        page: 1,
        errorMessage: null,
        searchQuery: query,
        selectedCategoryId: categoryId,
      );
    } else {
      if (state.page >= state.totalPages) return;
      state = state.copyWith(isLoadingMore: true);
    }

    try {
      final repo = _ref.read(templateRepositoryProvider);
      final int targetPage = reset ? 1 : state.page + 1;

      final result = query.isNotEmpty
          ? await repo.searchTemplates(query, page: targetPage)
          : await repo.getTemplates(categoryId: categoryId, page: targetPage);

      state = state.copyWith(
        isLoading: false,
        isLoadingMore: false,
        templates: reset ? result.templates : [...state.templates, ...result.templates],
        page: result.pagination.page,
        totalPages: result.pagination.totalPages,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        isLoadingMore: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> selectCategory(String? categoryId) async {
    await fetchTemplates(categoryId: categoryId, query: state.searchQuery, reset: true);
  }

  Future<void> search(String query) async {
    await fetchTemplates(categoryId: state.selectedCategoryId, query: query, reset: true);
  }

  Future<Template> fetchTemplateDetail(String id) async {
    return await _ref.read(templateRepositoryProvider).getTemplateById(id);
  }

  Future<void> deleteTemplate(String id) async {
    try {
      await _ref.read(templateRepositoryProvider).deleteTemplate(id);
      state = state.copyWith(
        templates: state.templates.where((t) => t.id != id).toList(),
      );
    } catch (_) {}
  }

  Future<void> updateTemplate({
    required String id,
    required String title,
    required String content,
    required String categoryId,
    String? description,
    String? thumbnailUrl,
    bool? isPremium,
  }) async {
    await _ref.read(templateRepositoryProvider).updateTemplate(
      id: id,
      title: title,
      content: content,
      categoryId: categoryId,
      description: description,
      thumbnailUrl: thumbnailUrl,
      isPremium: isPremium,
    );
  }
}

final templateProvider = StateNotifierProvider<TemplateNotifier, TemplateState>((ref) {
  return TemplateNotifier(ref);
});
