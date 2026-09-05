import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:promting_app/data/models/category.dart';
import 'base_providers.dart';

class CategoryState {
  final List<Category> categories;
  final bool isLoading;
  final String? errorMessage;

  CategoryState({
    required this.categories,
    this.isLoading = false,
    this.errorMessage,
  });

  factory CategoryState.initial() => CategoryState(categories: []);

  CategoryState copyWith({
    List<Category>? categories,
    bool? isLoading,
    String? errorMessage,
  }) {
    return CategoryState(
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
    );
  }
}

class CategoryNotifier extends StateNotifier<CategoryState> {
  final Ref _ref;

  CategoryNotifier(this._ref) : super(CategoryState.initial()) {
    fetchCategories();
  }

  Future<void> fetchCategories() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final list = await _ref.read(categoryRepositoryProvider).getCategories();
      state = CategoryState(categories: list, isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<bool> createCategory({required String name, String? icon, String? color}) async {
    try {
      await _ref.read(categoryRepositoryProvider).createCategory(name: name, icon: icon, color: color);
      await fetchCategories();
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteCategory(String id) async {
    try {
      await _ref.read(categoryRepositoryProvider).deleteCategory(id);
      await fetchCategories();
      return true;
    } catch (_) {
      return false;
    }
  }
}

final categoryProvider = StateNotifierProvider<CategoryNotifier, CategoryState>((ref) {
  return CategoryNotifier(ref);
});
