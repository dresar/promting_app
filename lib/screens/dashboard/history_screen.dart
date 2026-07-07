import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/shimmer_loading.dart';
import 'package:promting_app/core/utils/formatters.dart';

// Filter kategori history
const _historyFilters = [
  _HistoryFilter(label: 'Semua', icon: Icons.apps_rounded, color: Color(0xFF6366F1)),
  _HistoryFilter(label: 'Edukasi', icon: Icons.school_rounded, color: Color(0xFF6366F1)),
  _HistoryFilter(label: 'Iklan Produk', icon: Icons.shopping_bag_rounded, color: Color(0xFFFF6B35)),
  _HistoryFilter(label: 'Produk Digital', icon: Icons.rocket_launch_rounded, color: Color(0xFF7C3AED)),
  _HistoryFilter(label: 'Logo', icon: Icons.palette_rounded, color: Color(0xFFD946EF)),
  _HistoryFilter(label: 'Kata Mutiara', icon: Icons.format_quote_rounded, color: Color(0xFFF59E0B)),
  _HistoryFilter(label: 'Spanduk', icon: Icons.crop_original_rounded, color: Color(0xFF0D9488)),
];

class _HistoryFilter {
  final String label;
  final IconData icon;
  final Color color;
  const _HistoryFilter({required this.label, required this.icon, required this.color});
}

class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  final _scrollController = ScrollController();
  String _selectedFilter = 'Semua';

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
    Future.microtask(() {
      ref.read(promptProvider.notifier).fetchHistory(reset: true);
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      ref.read(promptProvider.notifier).fetchHistory(
            reset: false,
            contentType: _selectedFilter == 'Semua' ? null : _selectedFilter,
          );
    }
  }

  void _applyFilter(String filter) {
    if (_selectedFilter == filter) return;
    setState(() => _selectedFilter = filter);
    ref.read(promptProvider.notifier).fetchHistory(
          reset: true,
          contentType: filter == 'Semua' ? null : filter,
        );
  }

  /// Maps a filter label to backend contentType string for partial matching
  /// Some filters may not match exactly — handled by backend query.
  String? _getContentTypeForFilter(String filter) {
    if (filter == 'Semua') return null;
    // Specific mappings
    const filterMap = {
      'Iklan Produk': 'Iklan Produk',
      'Produk Digital': 'Produk Digital',
      'Edukasi': 'Edukasi',
      'Logo': 'Logo',
      'Kata Mutiara': 'Kata Mutiara',
      'Spanduk': 'Spanduk',
    };
    return filterMap[filter] ?? filter;
  }

  @override
  Widget build(BuildContext context) {
    final promptState = ref.watch(promptProvider);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Riwayat Prompt'),
        elevation: 0,
      ),
      body: Column(
        children: [
          // ── Filter Chips Bar ────────────────────────────────────────────
          _buildFilterBar(isDark),

          // ── History List ────────────────────────────────────────────────
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await ref.read(promptProvider.notifier).fetchHistory(
                      reset: true,
                      contentType: _selectedFilter == 'Semua'
                          ? null
                          : _selectedFilter,
                    );
              },
              child: promptState.isLoadingHistories && promptState.histories.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      child: ShimmerLoading.cardListSkeleton(),
                    )
                  : promptState.histories.isEmpty
                      ? _buildEmptyState(isDark)
                      : ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20.0, vertical: 12.0),
                          itemCount: promptState.histories.length +
                              (promptState.isLoadingMoreHistories ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index >= promptState.histories.length) {
                              return const Padding(
                                padding: EdgeInsets.symmetric(vertical: 12),
                                child: ShimmerLoading(
                                    width: double.infinity, height: 80),
                              );
                            }
                            final item = promptState.histories[index];
                            return Dismissible(
                              key: Key(item.id),
                              direction: DismissDirection.endToStart,
                              background: Container(
                                alignment: Alignment.centerRight,
                                padding: const EdgeInsets.only(right: 20),
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.error,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: const Icon(Icons.delete_outline_rounded,
                                    color: Colors.white),
                              ),
                              onDismissed: (_) async {
                                try {
                                  await ref
                                      .read(promptProvider.notifier)
                                      .deleteHistory(item.id);
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                          content: Text('Riwayat dihapus')),
                                    );
                                  }
                                } catch (e) {
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                          content: Text(
                                              'Gagal menghapus riwayat: $e')),
                                    );
                                  }
                                  ref
                                      .read(promptProvider.notifier)
                                      .fetchHistory(reset: true);
                                }
                              },
                              child: _buildHistoryCard(context, item, theme, isDark),
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar(bool isDark) {
    return Container(
      height: 56,
      decoration: BoxDecoration(
        color: isDark
            ? const Color(0xFF0F0A1E).withValues(alpha: 0.8)
            : Colors.white,
        border: Border(
          bottom: BorderSide(
            color: isDark
                ? Colors.white.withValues(alpha: 0.08)
                : Colors.grey.withValues(alpha: 0.15),
          ),
        ),
      ),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        itemCount: _historyFilters.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final filter = _historyFilters[index];
          final isSelected = _selectedFilter == filter.label;

          return GestureDetector(
            onTap: () => _applyFilter(filter.label),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
              decoration: BoxDecoration(
                gradient: isSelected
                    ? LinearGradient(
                        colors: [
                          filter.color,
                          filter.color.withValues(alpha: 0.7)
                        ],
                      )
                    : null,
                color: isSelected
                    ? null
                    : isDark
                        ? Colors.white.withValues(alpha: 0.05)
                        : Colors.grey.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected
                      ? Colors.transparent
                      : isDark
                          ? Colors.white.withValues(alpha: 0.12)
                          : Colors.grey.withValues(alpha: 0.2),
                ),
                boxShadow: isSelected
                    ? [
                        BoxShadow(
                          color: filter.color.withValues(alpha: 0.3),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        )
                      ]
                    : null,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    filter.icon,
                    size: 14,
                    color: isSelected
                        ? Colors.white
                        : isDark
                            ? Colors.white54
                            : Colors.grey[600],
                  ),
                  const SizedBox(width: 6),
                  Text(
                    filter.label,
                    style: TextStyle(
                      color: isSelected
                          ? Colors.white
                          : isDark
                              ? Colors.white70
                              : Colors.grey[700],
                      fontSize: 12,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    // Find the current filter info
    final filter = _historyFilters
        .firstWhere((f) => f.label == _selectedFilter,
            orElse: () => _historyFilters.first);

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: filter.color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              filter.icon,
              size: 48,
              color: filter.color.withValues(alpha: 0.6),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            _selectedFilter == 'Semua'
                ? 'Belum ada riwayat'
                : 'Belum ada riwayat untuk\n"$_selectedFilter"',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isDark ? Colors.white54 : Colors.grey[600],
              fontSize: 15,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Mulai buat prompt AI pertamamu!',
            style: TextStyle(
              color: isDark ? Colors.white38 : Colors.grey[400],
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(BuildContext context, dynamic item, ThemeData theme, bool isDark) {
    // Determine card accent color based on contentType
    final Color accentColor = _getContentTypeColor(item.contentType);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark
            ? Colors.white.withValues(alpha: 0.04)
            : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark
              ? Colors.white.withValues(alpha: 0.08)
              : Colors.grey.withValues(alpha: 0.15),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => context.push('/prompt/${item.id}'),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left accent bar
              Container(
                width: 4,
                height: 60,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [accentColor, accentColor.withValues(alpha: 0.4)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 12),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            item.title,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                              color: isDark ? Colors.white : Colors.black87,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            item.isFavorite
                                ? Icons.favorite_rounded
                                : Icons.favorite_outline_rounded,
                            color: item.isFavorite
                                ? theme.colorScheme.error
                                : null,
                            size: 20,
                          ),
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () {
                            ref
                                .read(promptProvider.notifier)
                                .toggleFavorite(item.id, item.isFavorite);
                          },
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 6,
                      runSpacing: 4,
                      children: [
                        _buildInfoChip(context, item.contentType, accentColor),
                        _buildInfoChip(context, '${item.slideCount} Slide',
                            Colors.grey),
                        if (item.imageOrientation.isNotEmpty)
                          _buildInfoChip(
                              context,
                              item.imageOrientation.contains('1:1')
                                  ? '1:1'
                                  : item.imageOrientation.contains('3:4')
                                      ? '3:4'
                                      : item.imageOrientation.contains('16:9')
                                          ? '16:9'
                                          : '4:5',
                              Colors.blueGrey),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      Formatters.formatDateTime(item.createdAt),
                      style: TextStyle(
                        fontSize: 10,
                        color: isDark
                            ? Colors.white38
                            : Colors.grey[400],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getContentTypeColor(String contentType) {
    final lower = contentType.toLowerCase();
    if (lower.contains('edukasi')) return const Color(0xFF6366F1);
    if (lower.contains('iklan') || lower.contains('affiliate') || lower.contains('produk') && !lower.contains('digital')) {
      return const Color(0xFFFF6B35);
    }
    if (lower.contains('digital')) return const Color(0xFF7C3AED);
    if (lower.contains('logo')) return const Color(0xFFD946EF);
    if (lower.contains('mutiara') || lower.contains('quote')) return const Color(0xFFF59E0B);
    if (lower.contains('spanduk') || lower.contains('banner') || lower.contains('baliho')) return const Color(0xFF0D9488);
    return const Color(0xFF6366F1);
  }

  Widget _buildInfoChip(BuildContext context, String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: color,
        ),
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
    );
  }
}
