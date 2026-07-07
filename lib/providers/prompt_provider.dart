import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/data/models/favorite_prompt.dart';
import 'package:promting_app/data/models/prompt_history.dart';
import 'user_provider.dart';
import 'base_providers.dart';

class PromptState {
  final List<PromptHistory> histories;
  final List<FavoritePrompt> favorites;
  final bool isLoadingHistories;
  final bool isLoadingMoreHistories;
  final bool isLoadingFavorites;
  final bool isLoadingMoreFavorites;
  final bool isGenerating;
  final int historyPage;
  final int historyTotalPages;
  final int favoritePage;
  final int favoriteTotalPages;
  final PromptHistory? generatedPrompt;
  final String? errorMessage;

  PromptState({
    required this.histories,
    required this.favorites,
    this.isLoadingHistories = false,
    this.isLoadingMoreHistories = false,
    this.isLoadingFavorites = false,
    this.isLoadingMoreFavorites = false,
    this.isGenerating = false,
    this.historyPage = 1,
    this.historyTotalPages = 1,
    this.favoritePage = 1,
    this.favoriteTotalPages = 1,
    this.generatedPrompt,
    this.errorMessage,
  });

  factory PromptState.initial() => PromptState(histories: [], favorites: []);

  PromptState copyWith({
    List<PromptHistory>? histories,
    List<FavoritePrompt>? favorites,
    bool? isLoadingHistories,
    bool? isLoadingMoreHistories,
    bool? isLoadingFavorites,
    bool? isLoadingMoreFavorites,
    bool? isGenerating,
    int? historyPage,
    int? historyTotalPages,
    int? favoritePage,
    int? favoriteTotalPages,
    PromptHistory? generatedPrompt,
    String? errorMessage,
  }) {
    return PromptState(
      histories: histories ?? this.histories,
      favorites: favorites ?? this.favorites,
      isLoadingHistories: isLoadingHistories ?? this.isLoadingHistories,
      isLoadingMoreHistories: isLoadingMoreHistories ?? this.isLoadingMoreHistories,
      isLoadingFavorites: isLoadingFavorites ?? this.isLoadingFavorites,
      isLoadingMoreFavorites: isLoadingMoreFavorites ?? this.isLoadingMoreFavorites,
      isGenerating: isGenerating ?? this.isGenerating,
      historyPage: historyPage ?? this.historyPage,
      historyTotalPages: historyTotalPages ?? this.historyTotalPages,
      favoritePage: favoritePage ?? this.favoritePage,
      favoriteTotalPages: favoriteTotalPages ?? this.favoriteTotalPages,
      generatedPrompt: generatedPrompt ?? this.generatedPrompt,
      errorMessage: errorMessage,
    );
  }
}

class PromptNotifier extends StateNotifier<PromptState> {
  final Ref _ref;

  PromptNotifier(this._ref) : super(PromptState.initial());

  Future<void> generatePrompt({
    required String title,
    required String contentType,
    required int slideCount,
    required String designStyle,
    required String targetAudience,
    required String imageOrientation,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generatePrompt(
        title: title,
        contentType: contentType,
        slideCount: slideCount,
        designStyle: designStyle,
        targetAudience: targetAudience,
        imageOrientation: imageOrientation,
        includeCaption: includeCaption,
        characterId: characterId,
        useCharacter: useCharacter,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }

  Future<void> generateAdPrompt({
    required String title,
    required String contentType,
    required int slideCount,
    required String designStyle,
    required String targetAudience,
    required String imageOrientation,
    required String? sourceImageUrl,
    required String description,
    required String? brand,
    required String? price,
    required String? sellingPoints,
    required String? cta,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generateAdPrompt(
        title: title,
        contentType: contentType,
        slideCount: slideCount,
        designStyle: designStyle,
        targetAudience: targetAudience,
        imageOrientation: imageOrientation,
        sourceImageUrl: sourceImageUrl,
        description: description,
        brand: brand,
        price: price,
        sellingPoints: sellingPoints,
        cta: cta,
        includeCaption: includeCaption,
        characterId: characterId,
        useCharacter: useCharacter,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }

  Future<void> generateBannerPrompt({
    required String title,
    required String contentType,
    required String businessType,
    required String designStyle,
    required String description,
    required String layoutSize,
    required String? contactInfo,
    required String? sourceImageUrl,
    bool includeCaption = true,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generateBannerPrompt(
        title: title,
        contentType: contentType,
        businessType: businessType,
        designStyle: designStyle,
        description: description,
        layoutSize: layoutSize,
        contactInfo: contactInfo,
        sourceImageUrl: sourceImageUrl,
        includeCaption: includeCaption,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }

  Future<void> generateLogoPrompt({
    required String title,
    required String contentType,
    required String designStyle,
    required String description,
    required String layoutSize,
    required String shape,
    required int slideCount,
    required String? sourceImageUrl,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generateLogoPrompt(
        title: title,
        contentType: contentType,
        designStyle: designStyle,
        description: description,
        layoutSize: layoutSize,
        shape: shape,
        slideCount: slideCount,
        sourceImageUrl: sourceImageUrl,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }

  Future<void> generateQuotePrompt({
    required String quoteText,
    String? quoteAuthor,
    String? characterId,
    bool? useCharacter,
    String imageOrientation = 'Persegi (Square 1:1)',
    String? moodOverride,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generateQuotePrompt(
        quoteText: quoteText,
        quoteAuthor: quoteAuthor,
        characterId: characterId,
        useCharacter: useCharacter,
        imageOrientation: imageOrientation,
        moodOverride: moodOverride,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }

  Future<void> generateDigitalProductPrompt({
    required String title,
    required String slideCount,
    required String designStyle,
    required String targetAudience,
    required String description,
    String? brand,
    String? price,
    String? productType,
    String? additionalPrompt,
    String? sourceImageUrl,
    bool includeCaption = true,
    String? characterId,
    bool? useCharacter,
    String? color1,
    String? color2,
  }) async {
    state = state.copyWith(isGenerating: true, errorMessage: null, generatedPrompt: null);
    try {
      final repo = _ref.read(promptRepositoryProvider);
      final result = await repo.generateDigitalProductPrompt(
        title: title,
        slideCount: slideCount,
        designStyle: designStyle,
        targetAudience: targetAudience,
        description: description,
        brand: brand,
        price: price,
        productType: productType,
        additionalPrompt: additionalPrompt,
        sourceImageUrl: sourceImageUrl,
        includeCaption: includeCaption,
        characterId: characterId,
        useCharacter: useCharacter,
        color1: color1,
        color2: color2,
      );
      state = state.copyWith(isGenerating: false, generatedPrompt: result);
      _ref.read(userProvider.notifier).refreshProfile();
      fetchHistory(reset: true);
    } catch (e) {
      state = state.copyWith(isGenerating: false, errorMessage: e.toString());
    }
  }


  Future<void> fetchHistory({bool reset = true, String? contentType}) async {
    if (reset) {
      state = state.copyWith(isLoadingHistories: true, histories: [], historyPage: 1, errorMessage: null);
    } else {
      if (state.historyPage >= state.historyTotalPages) return;
      state = state.copyWith(isLoadingMoreHistories: true);
    }


    try {
      final repo = _ref.read(promptRepositoryProvider);
      final targetPage = reset ? 1 : state.historyPage + 1;
      final result = await repo.getPromptHistory(page: targetPage, contentType: contentType);

      state = state.copyWith(
        isLoadingHistories: false,
        isLoadingMoreHistories: false,
        histories: reset ? result.histories : [...state.histories, ...result.histories],
        historyPage: result.pagination.page,
        historyTotalPages: result.pagination.totalPages,
      );
    } catch (e) {
      state = state.copyWith(
        isLoadingHistories: false,
        isLoadingMoreHistories: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> fetchFavorites({bool reset = true}) async {
    if (reset) {
      state = state.copyWith(isLoadingFavorites: true, favorites: [], favoritePage: 1, errorMessage: null);
    } else {
      if (state.favoritePage >= state.favoriteTotalPages) return;
      state = state.copyWith(isLoadingMoreFavorites: true);
    }

    try {
      final repo = _ref.read(promptRepositoryProvider);
      final targetPage = reset ? 1 : state.favoritePage + 1;
      final result = await repo.getFavoritePrompts(page: targetPage);

      state = state.copyWith(
        isLoadingFavorites: false,
        isLoadingMoreFavorites: false,
        favorites: reset ? result.favorites : [...state.favorites, ...result.favorites],
        favoritePage: result.pagination.page,
        favoriteTotalPages: result.pagination.totalPages,
      );
    } catch (e) {
      state = state.copyWith(
        isLoadingFavorites: false,
        isLoadingMoreFavorites: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> toggleFavorite(String historyId, bool isFavoriteNow) async {
    try {
      final repo = _ref.read(promptRepositoryProvider);
      if (isFavoriteNow) {
        await repo.removeFavorite(historyId);
      } else {
        await repo.addFavorite(historyId);
      }

      state = state.copyWith(
        histories: state.histories.map((h) {
          if (h.id == historyId) {
            return PromptHistory(
              id: h.id,
              userId: h.userId,
              title: h.title,
              contentType: h.contentType,
              slideCount: h.slideCount,
              designStyle: h.designStyle,
              targetAudience: h.targetAudience,
              language: h.language,
              generatedPrompt: h.generatedPrompt,
              createdAt: h.createdAt,
              updatedAt: h.updatedAt,
              isFavorite: !isFavoriteNow,
              imageOrientation: h.imageOrientation,
              instagramCaption: h.instagramCaption,
              tiktokCaption: h.tiktokCaption,
              hashtags: h.hashtags,
              slides: h.slides,
            );
          }
          return h;
        }).toList(),
      );

      _ref.read(userProvider.notifier).refreshProfile();
      fetchFavorites(reset: true);
    } catch (_) {}
  }

  Future<void> deleteHistory(String id) async {
    try {
      await _ref.read(promptRepositoryProvider).deleteHistory(id);
      state = state.copyWith(
        histories: state.histories.where((h) => h.id != id).toList(),
      );
      _ref.read(userProvider.notifier).refreshProfile();
      fetchFavorites(reset: true);
    } catch (e) {
      state = state.copyWith(errorMessage: e.toString());
      rethrow;
    }
  }
}

final promptProvider = StateNotifierProvider<PromptNotifier, PromptState>((ref) {
  return PromptNotifier(ref);
});
