import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:promting_app/providers/auth_provider.dart';
import 'package:promting_app/providers/dashboard_provider.dart';
import 'package:promting_app/providers/category_provider.dart';
import 'package:promting_app/providers/template_provider.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/shimmer_loading.dart';
import 'package:promting_app/providers/settings_provider.dart';
import 'package:promting_app/core/config/env_config.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(categoryProvider.notifier).fetchCategories();
      ref.read(templateProvider.notifier).fetchTemplates();
      ref.read(promptProvider.notifier).fetchHistory(reset: true);
    });
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final categoryState = ref.watch(categoryProvider);
    final templateState = ref.watch(templateProvider);
    final promptState = ref.watch(promptProvider);
    final settingsState = ref.watch(settingsProvider);
    final theme = Theme.of(context);
    final user = authState.user;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            ref.read(categoryProvider.notifier).fetchCategories();
            ref.read(templateProvider.notifier).fetchTemplates();
            ref.read(promptProvider.notifier).fetchHistory(reset: true);
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _getGreeting(),
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.onBackground.withOpacity(0.5),
                            ),
                          ),
                          Text(
                            user?.name ?? 'Pengguna',
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 22,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: Icon(
                        settingsState.settings.theme == 'DARK' 
                            ? Icons.light_mode_rounded 
                            : Icons.dark_mode_rounded,
                        color: theme.colorScheme.primary,
                      ),
                      onPressed: () {
                        final currentTheme = settingsState.settings.theme;
                        final newTheme = currentTheme == 'DARK' ? 'LIGHT' : 'DARK';
                        ref.read(settingsProvider.notifier).updateTheme(newTheme);
                      },
                    ),
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () => context.push('/settings'),
                      child: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: theme.colorScheme.primary.withOpacity(0.1), width: 2),
                        ),
                        child: ClipOval(
                          child: user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty
                              ? CachedNetworkImage(
                                  imageUrl: user.avatarUrl!,
                                  fit: BoxFit.cover,
                                  placeholder: (context, url) => const ShimmerLoading(width: 48, height: 48, borderRadius: 24),
                                  errorWidget: (context, url, error) => const Icon(Icons.person_rounded),
                                )
                              : const Icon(Icons.person_rounded),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                // Main Action Cards - Modern & Simplified
                _buildModernActionCard(
                  context,
                  title: 'Prompa Edukasi',
                  subtitle: 'Carousel edukasi interaktif',
                  icon: Icons.school_rounded,
                  colors: [const Color(0xFF6366F1), const Color(0xFF4F46E5)],
                  onTap: () => context.push('/generate-edu'),
                ),
                const SizedBox(height: 12),
                _buildModernActionCard(
                  context,
                  title: 'Iklan Affiliate',
                  subtitle: 'Iklan produk viral & konversi',
                  icon: Icons.shopping_bag_rounded,
                  colors: [const Color(0xFFFF6B35), const Color(0xFFE0531D)],
                  onTap: () => context.push('/generate-ad'),
                ),
                const SizedBox(height: 12),
                _buildModernActionCard(
                  context,
                  title: 'Kata Mutiara',
                  subtitle: 'Foto sinematik & estetik',
                  icon: Icons.format_quote_rounded,
                  colors: [const Color(0xFFF59E0B), const Color(0xFFEF4444)],
                  onTap: () => context.push('/generate-quote'),
                ),

                const SizedBox(height: 28),
                Text(
                  'Kategori Pilihan',
                  style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  height: 40,
                  child: categoryState.isLoading
                      ? ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: 4,
                          itemBuilder: (context, index) => const Padding(
                            padding: EdgeInsets.only(right: 8.0),
                            child: ShimmerLoading(width: 100, height: 40, borderRadius: 12),
                          ),
                        )
                      : ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: categoryState.categories.length,
                          itemBuilder: (context, index) {
                            final cat = categoryState.categories[index];
                            final isUrl = cat.icon != null && (cat.icon!.startsWith('http') || cat.icon!.contains('assets/') || cat.icon!.contains('assets\\') || cat.icon!.contains('.png') || cat.icon!.contains('.jpg'));
                            final iconUrl = isUrl ? (cat.icon!.startsWith('http') ? cat.icon! : '${EnvConfig.baseUrl}${cat.icon!.startsWith("/") ? "" : "/"}${cat.icon}') : null;
                            
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: InputChip(
                                avatar: isUrl ? ClipRRect(
                                  borderRadius: BorderRadius.circular(4),
                                  child: CachedNetworkImage(
                                    imageUrl: iconUrl!,
                                    width: 24, height: 24, fit: BoxFit.cover,
                                    errorWidget: (context, url, error) => const Text('💡'),
                                  )
                                ) : null,
                                label: Text(isUrl ? cat.name : '${cat.icon ?? "💡"} ${cat.name}'),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                onPressed: () {
                                  ref.read(dashboardTabIndexProvider.notifier).state = 1;
                                },
                              ),
                            );
                          },
                        ),
                ),
                const SizedBox(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Template Populer',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                templateState.isLoading
                    ? ShimmerLoading.cardListSkeleton()
                    : ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: templateState.templates.length > 3 ? 3 : templateState.templates.length,
                        itemBuilder: (context, index) {
                          final temp = templateState.templates[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            child: ListTile(
                              contentPadding: const EdgeInsets.all(12),
                              leading: Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: theme.colorScheme.primary.withOpacity(0.05),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: temp.category?.icon != null && (temp.category!.icon!.startsWith('http') || temp.category!.icon!.contains('assets/') || temp.category!.icon!.contains('assets\\') || temp.category!.icon!.contains('.png') || temp.category!.icon!.contains('.jpg'))
                                      ? ClipRRect(
                                          borderRadius: BorderRadius.circular(12),
                                          child: CachedNetworkImage(
                                            imageUrl: temp.category!.icon!.startsWith('http') ? temp.category!.icon! : '${EnvConfig.baseUrl}${temp.category!.icon!.startsWith("/") ? "" : "/"}${temp.category!.icon}',
                                            width: 48, height: 48, fit: BoxFit.cover,
                                            errorWidget: (context, url, error) => const Text('📄', style: TextStyle(fontSize: 24)),
                                          )
                                        )
                                      : Text(
                                          temp.category?.icon ?? '📄',
                                          style: const TextStyle(fontSize: 24),
                                        ),
                                ),
                              ),
                              title: Text(
                                temp.title,
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                              subtitle: Text(
                                temp.description ?? '',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              trailing: Icon(Icons.arrow_forward_ios_rounded, size: 16, color: theme.colorScheme.onBackground.withOpacity(0.3)),
                              onTap: () => context.push('/template/${temp.id}'),
                            ),
                          );
                        },
                      ),
                const SizedBox(height: 28),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        'Riwayat Prompa Terakhir',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                promptState.isLoadingHistories
                    ? ShimmerLoading.cardListSkeleton()
                    : promptState.histories.isEmpty
                        ? const Center(
                            child: Padding(
                              padding: EdgeInsets.symmetric(vertical: 20),
                              child: Text('Belum ada riwayat prompa.'),
                            ),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: promptState.histories.length > 3 ? 3 : promptState.histories.length,
                            itemBuilder: (context, index) {
                              final item = promptState.histories[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: ListTile(
                                  contentPadding: const EdgeInsets.all(12),
                                  title: Text(
                                    item.title,
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  subtitle: Text(
                                    '${item.contentType} • ${item.slideCount} Slide',
                                  ),
                                  trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                                  onTap: () => context.push('/prompt/${item.id}'),
                                ),
                              );
                            },
                          ),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildModernActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> colors,
    required VoidCallback onTap,
  }) {
    final theme = Theme.of(context);
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: colors.first.withValues(alpha: 0.2),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(24),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: theme.dividerColor.withValues(alpha: 0.05),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: colors,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(icon, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.textTheme.bodySmall?.color?.withValues(alpha: 0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.arrow_forward_ios_rounded,
                  size: 14,
                  color: theme.dividerColor.withValues(alpha: 0.3),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
