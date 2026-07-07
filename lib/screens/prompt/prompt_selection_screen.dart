import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/core/constants/colors.dart';

class PromptSelectionScreen extends StatelessWidget {
  const PromptSelectionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pilih Generator'),
        leading: context.canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new_rounded),
                onPressed: () => context.pop(),
              )
            : null,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Mau buat konten apa hari ini?',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Pilih jenis generator untuk membuat prompt AI.',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                ),
              ),
              const SizedBox(height: 32),

              // Card 1: Edukasi
              _buildSelectionCard(
                context: context,
                title: 'Generator Edukasi',
                description: 'Buat prompt terstruktur untuk infografis & carousel edukasi.',
                icon: Icons.school_rounded,
                startColor: const Color(0xFF6366F1),
                endColor: const Color(0xFF4F46E5),
                onTap: () => context.push('/generate-edu'),
              ),
              const SizedBox(height: 20),

              // Card 2: Iklan Affiliate
              _buildSelectionCard(
                context: context,
                title: 'Generator Iklan Affiliate',
                description: 'Unggah foto produk untuk copywriting promosi & iklan konversi.',
                icon: Icons.shopping_bag_rounded,
                startColor: const Color(0xFFFF6B35),
                endColor: const Color(0xFFE0531D),
                tagText: 'BARU & VIRAL',
                onTap: () => context.push('/generate-ad'),
              ),
              const SizedBox(height: 20),

              // Card 3: Produk Digital (NEW)
              _buildSelectionCard(
                context: context,
                title: 'Generator Produk Digital',
                description: 'Upload gambar produk digital → AI analisis → prompt slide 1:1 premium dengan sosmed @digitalinka.id2027.',
                icon: Icons.rocket_launch_rounded,
                startColor: const Color(0xFF7C3AED),
                endColor: const Color(0xFFDB2777),
                tagText: '✨ BARU',
                onTap: () => context.push('/generate-digital-product'),
              ),
              const SizedBox(height: 20),

              // Card 4: Spanduk & Baliho Bisnis
              _buildSelectionCard(
                context: context,
                title: 'Generator Spanduk & Baliho',
                description: 'Rancang blueprint visual spanduk toko & baliho promosi.',
                icon: Icons.crop_original_rounded,
                startColor: const Color(0xFF0D9488),
                endColor: const Color(0xFF0F766E),
                tagText: 'PREMIUM',
                onTap: () => context.push('/generate-banner'),
              ),
              const SizedBox(height: 20),

              // Card 5: Pembuatan Logo
              _buildSelectionCard(
                context: context,
                title: 'Generator Pembuatan Logo',
                description: 'Buat konsep & prompt logo bisnis beserta filosofinya.',
                icon: Icons.palette_rounded,
                startColor: const Color(0xFFD946EF),
                endColor: const Color(0xFF8B5CF6),
                tagText: 'BARU',
                onTap: () => context.push('/generate-logo'),
              ),
              const SizedBox(height: 20),

              // Card 6: Kata Kata Mutiara
              _buildSelectionCard(
                context: context,
                title: 'Generator Kata Mutiara',
                description: 'Ubah quotes favorit menjadi prompt gambar estetik.',
                icon: Icons.format_quote_rounded,
                startColor: const Color(0xFFF59E0B),
                endColor: const Color(0xFFEF4444),
                tagText: 'BARU 🔥',
                onTap: () => context.push('/generate-quote'),
              ),

            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSelectionCard({
    required BuildContext context,
    required String title,
    required String description,
    required IconData icon,
    required Color startColor,
    required Color endColor,
    required VoidCallback onTap,
    String? tagText,
  }) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: startColor.withOpacity(isDark ? 0.15 : 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: isDark ? AppColors.darkSurface : Colors.white,
        borderRadius: BorderRadius.circular(24),
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          splashColor: startColor.withOpacity(0.1),
          highlightColor: startColor.withOpacity(0.05),
          child: Container(
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: isDark ? AppColors.darkBorder : AppColors.lightBorder,
                width: 1,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [startColor, endColor],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Icon(
                        icon,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                    if (tagText != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: startColor.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: Text(
                          tagText,
                          style: TextStyle(
                            color: startColor,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  title,
                  style: theme.textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  description,
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: isDark ? AppColors.darkTextSecondary : AppColors.lightTextSecondary,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    Text(
                      'Buka Generator',
                      style: TextStyle(
                        color: startColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Icon(
                      Icons.arrow_forward_rounded,
                      color: startColor,
                      size: 16,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
