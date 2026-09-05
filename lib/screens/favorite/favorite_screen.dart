import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/shimmer_loading.dart';
import 'package:promting_app/core/utils/formatters.dart';

class FavoriteScreen extends ConsumerStatefulWidget {
  const FavoriteScreen({super.key});

  @override
  ConsumerState<FavoriteScreen> createState() => _FavoriteScreenState();
}

class _FavoriteScreenState extends ConsumerState<FavoriteScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    Future.microtask(() {
      ref.read(promptProvider.notifier).fetchFavorites(reset: true);
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(promptProvider.notifier).fetchFavorites(reset: false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final promptState = ref.watch(promptProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Prompa Favorit'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(promptProvider.notifier).fetchFavorites(reset: true);
        },
        child: promptState.isLoadingFavorites && promptState.favorites.isEmpty
            ? Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20.0),
                child: ShimmerLoading.cardListSkeleton(),
              )
            : promptState.favorites.isEmpty
                ? const Center(
                    child: Text('Belum ada prompa yang difavoritkan.'),
                  )
                : ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                    itemCount: promptState.favorites.length + (promptState.isLoadingMoreFavorites ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index >= promptState.favorites.length) {
                        return const Padding(
                          padding: EdgeInsets.symmetric(vertical: 12),
                          child: ShimmerLoading(width: double.infinity, height: 80),
                        );
                      }
                      final fav = promptState.favorites[index];
                      final item = fav.promptHistory;

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(16),
                          title: Text(
                            item.title,
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 4,
                                children: [
                                  _buildInfoChip(context, item.contentType),
                                  _buildInfoChip(context, '${item.slideCount} Slide'),
                                  _buildInfoChip(context, item.designStyle),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                Formatters.formatDateTime(item.createdAt),
                                style: TextStyle(
                                  fontSize: 10,
                                  color: theme.colorScheme.onBackground.withOpacity(0.4),
                                ),
                              ),
                            ],
                          ),
                          trailing: IconButton(
                            icon: Icon(
                              Icons.favorite_rounded,
                              color: theme.colorScheme.error,
                            ),
                            onPressed: () {
                              ref.read(promptProvider.notifier).toggleFavorite(item.id, true);
                            },
                          ),
                          onTap: () => context.push('/prompt/${item.id}'),
                        ),
                      );
                    },
                  ),
      ),
    );
  }

  Widget _buildInfoChip(BuildContext context, String text) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: theme.colorScheme.primary,
        ),
      ),
    );
  }
}
