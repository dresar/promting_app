import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:promting_app/providers/category_provider.dart';
import 'package:promting_app/providers/template_provider.dart';
import 'package:promting_app/widgets/shimmer_loading.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/core/config/env_config.dart';

class TemplatesScreen extends ConsumerStatefulWidget {
  const TemplatesScreen({super.key});

  @override
  ConsumerState<TemplatesScreen> createState() => _TemplatesScreenState();
}

class _TemplatesScreenState extends ConsumerState<TemplatesScreen> {
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    Future.microtask(() {
      ref.read(templateProvider.notifier).fetchTemplates(reset: true);
      ref.read(categoryProvider.notifier).fetchCategories();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(templateProvider.notifier).fetchTemplates(
            categoryId: ref.read(templateProvider).selectedCategoryId,
            query: _searchController.text.trim(),
            reset: false,
          );
    }
  }

  void _showZoomDialog(BuildContext context, String imageUrl) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.all(12),
        child: Stack(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: InteractiveViewer(
                minScale: 0.5,
                maxScale: 5.0,
                child: Image.network(
                  imageUrl,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => const Center(
                    child: Icon(Icons.broken_image, size: 60, color: Colors.white70),
                  ),
                ),
              ),
            ),
            Positioned(
              top: 8,
              right: 8,
              child: GestureDetector(
                onTap: () => Navigator.of(ctx).pop(),
                child: Container(
                  decoration: const BoxDecoration(
                    color: Colors.black54,
                    shape: BoxShape.circle,
                  ),
                  padding: const EdgeInsets.all(8),
                  child: const Icon(Icons.close, color: Colors.white, size: 20),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final templateState = ref.watch(templateProvider);
    final categoryState = ref.watch(categoryProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Template Prompa'),
        elevation: 0,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
            child: CustomTextField(
              controller: _searchController,
              labelText: 'Cari Template...',
              prefixIcon: Icons.search_rounded,
              hintText: 'ketik nama atau topik template',
              validator: null,
              keyboardType: TextInputType.text,
              maxLines: 1,
            ),
          ),
          SizedBox(
            height: 48,
            child: categoryState.isLoading
                ? ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: 4,
                    itemBuilder: (context, index) => const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 6.0),
                      child: ShimmerLoading(width: 90, height: 36, borderRadius: 12),
                    ),
                  )
                : ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: categoryState.categories.length + 1,
                    itemBuilder: (context, index) {
                      if (index == 0) {
                        final isSelected = templateState.selectedCategoryId == null;
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4.0),
                          child: ChoiceChip(
                            label: const Text('Semua'),
                            selected: isSelected,
                            onSelected: (_) {
                              ref.read(templateProvider.notifier).selectCategory(null);
                            },
                          ),
                        );
                      }
                      final cat = categoryState.categories[index - 1];
                      final isSelected = templateState.selectedCategoryId == cat.id;
                      final isUrl = cat.icon != null && (cat.icon!.startsWith('http') || cat.icon!.contains('assets/') || cat.icon!.contains('assets\\') || cat.icon!.contains('.png') || cat.icon!.contains('.jpg'));
                      final iconUrl = isUrl ? (cat.icon!.startsWith('http') ? cat.icon! : '${EnvConfig.baseUrl}${cat.icon!.startsWith("/") ? "" : "/"}${cat.icon}') : null;
                      
                      return Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 4.0),
                        child: ChoiceChip(
                          avatar: isUrl ? ClipRRect(
                            borderRadius: BorderRadius.circular(4),
                            child: CachedNetworkImage(
                              imageUrl: iconUrl!,
                              width: 24, height: 24, fit: BoxFit.cover,
                              errorWidget: (context, url, error) => const Text('💡'),
                            )
                          ) : null,
                          label: Text(isUrl ? cat.name : '${cat.icon ?? "💡"} ${cat.name}'),
                          selected: isSelected,
                          onSelected: (_) {
                            ref.read(templateProvider.notifier).selectCategory(cat.id);
                          },
                        ),
                      );
                    },
                  ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await ref.read(templateProvider.notifier).fetchTemplates(
                      categoryId: templateState.selectedCategoryId,
                      query: _searchController.text.trim(),
                      reset: true,
                    );
              },
              child: templateState.isLoading && templateState.templates.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: ShimmerLoading.gridSkeleton(),
                    )
                  : templateState.templates.isEmpty
                      ? const Center(
                          child: Text('Tidak ada template ditemukan.'),
                        )
                      : GridView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 16,
                            crossAxisSpacing: 16,
                            childAspectRatio: 0.71,
                          ),
                          itemCount: templateState.templates.length + (templateState.isLoadingMore ? 2 : 0),
                          itemBuilder: (context, index) {
                            if (index >= templateState.templates.length) {
                              return const Center(
                                child: Padding(
                                  padding: EdgeInsets.all(8.0),
                                  child: CircularProgressIndicator(),
                                ),
                              );
                            }
                            final temp = templateState.templates[index];
                            
                            String? imageUrl;
                            if (temp.thumbnailUrl != null && temp.thumbnailUrl!.isNotEmpty) {
                              try {
                                if (temp.thumbnailUrl!.startsWith('[')) {
                                  final List<dynamic> decoded = jsonDecode(temp.thumbnailUrl!);
                                  if (decoded.isNotEmpty) {
                                    imageUrl = decoded.first.toString();
                                  }
                                } else {
                                  imageUrl = temp.thumbnailUrl!;
                                }
                              } catch (_) {}
                            }
                            if (imageUrl != null && !imageUrl.startsWith('http')) {
                              imageUrl = '${EnvConfig.baseUrl}${imageUrl.startsWith("/") ? "" : "/"}$imageUrl';
                            }

                            return Card(
                              clipBehavior: Clip.antiAlias,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                              elevation: 2,
                              child: InkWell(
                                onTap: () => context.push('/template/${temp.id}'),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    // Rectangular image area (takes most of the card)
                                    Expanded(
                                      child: GestureDetector(
                                        onTap: () {
                                          if (imageUrl != null) {
                                            _showZoomDialog(context, imageUrl);
                                          } else {
                                            context.push('/template/${temp.id}');
                                          }
                                        },
                                        child: imageUrl != null
                                            ? Image.network(
                                                imageUrl,
                                                fit: BoxFit.cover,
                                                errorBuilder: (_, __, ___) => Container(
                                                  color: theme.colorScheme.primary.withOpacity(0.05),
                                                  child: const Icon(Icons.broken_image, size: 40, color: Colors.grey),
                                                ),
                                              )
                                            : Container(
                                                color: theme.colorScheme.primary.withOpacity(0.05),
                                                child: Center(
                                                  child: temp.category?.icon != null && (temp.category!.icon!.startsWith('http') || temp.category!.icon!.contains('assets/') || temp.category!.icon!.contains('assets\\') || temp.category!.icon!.contains('.png') || temp.category!.icon!.contains('.jpg'))
                                                      ? CachedNetworkImage(
                                                          imageUrl: temp.category!.icon!.startsWith('http') ? temp.category!.icon! : '${EnvConfig.baseUrl}${temp.category!.icon!.startsWith("/") ? "" : "/"}${temp.category!.icon}',
                                                          width: 48, height: 48, fit: BoxFit.cover,
                                                          errorWidget: (context, url, error) => const Text('📄', style: TextStyle(fontSize: 40)),
                                                        )
                                                      : Text(temp.category?.icon ?? '📄', style: const TextStyle(fontSize: 40)),
                                                ),
                                              ),
                                      ),
                                    ),
                                    // Title below image
                                    Padding(
                                      padding: const EdgeInsets.only(left: 10, right: 10, top: 4, bottom: 6),
                                      child: Text(
                                        temp.title,
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: theme.textTheme.bodyMedium?.copyWith(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
    );
  }
}
