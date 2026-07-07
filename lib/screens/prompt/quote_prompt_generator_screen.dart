import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/core/constants/colors.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/data/models/character.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/toast_message.dart';

// ─── Suasana Options ────────────────────────────────────────────────────────
const _suasanaOptions = [
  _SuasanaOption(
    key: 'auto',
    label: '✨ Auto (Deteksi AI)',
    description: 'Biarkan AI memilih suasana yang paling sesuai',
    emoji: '🤖',
    color: Color(0xFF6366F1),
  ),
  _SuasanaOption(
    key: 'sedih',
    label: '😢 Sedih / Melankolis',
    description: 'Kota malam, rooftop sunyi, senja sepi',
    emoji: '🌃',
    color: Color(0xFF4A6FA5),
  ),
  _SuasanaOption(
    key: 'motivasi',
    label: '🔥 Motivasi / Semangat',
    description: 'Matahari terbit dramatis, puncak gunung',
    emoji: '🌅',
    color: Color(0xFFF59E0B),
  ),
  _SuasanaOption(
    key: 'cinta',
    label: '❤️ Cinta / Romantis',
    description: 'Kota malam romantis, danau bintang',
    emoji: '🌉',
    color: Color(0xFFEC4899),
  ),
  _SuasanaOption(
    key: 'religius',
    label: '🌟 Religius / Spiritual',
    description: 'Masjid indah, cahaya fajar suci',
    emoji: '🕌',
    color: Color(0xFF10B981),
  ),
  _SuasanaOption(
    key: 'bijak',
    label: '📚 Bijak / Filosofis',
    description: 'Langit berbintang, Milky Way, alam luas',
    emoji: '🌌',
    color: Color(0xFF8B5CF6),
  ),
  _SuasanaOption(
    key: 'bahagia',
    label: '😊 Bahagia / Gembira',
    description: 'Sunset laut, pantai emas, langit cerah',
    emoji: '🌅',
    color: Color(0xFFEAB308),
  ),
  _SuasanaOption(
    key: 'perjuangan',
    label: '💪 Perjuangan / Kerja Keras',
    description: 'Cityscape fajar, vantage point dramatis',
    emoji: '🌆',
    color: Color(0xFFEF4444),
  ),
  _SuasanaOption(
    key: 'alam',
    label: '🌿 Kedamaian / Alam',
    description: 'Air terjun hutan, kabut pagi, damai',
    emoji: '🌊',
    color: Color(0xFF059669),
  ),
  _SuasanaOption(
    key: 'nostalgia',
    label: '🕰️ Nostalgia / Kenangan',
    description: 'Desa senja, foto film, nuansa masa lalu',
    emoji: '🌄',
    color: Color(0xFFD97706),
  ),
];

// ─── Orientasi Options ───────────────────────────────────────────────────────
const _orientationOptions = [
  'Potret TikTok 3:4 (1080×1440px) — Rekomendasi',
  'Persegi 1:1 (1080×1080px) — Feed Instagram',
  'Potret Instagram 4:5 (1080×1350px)',
  'Persegi Panjang 16:9 (1920×1080px) — Landscape',
];

class _SuasanaOption {
  final String key;
  final String label;
  final String description;
  final String emoji;
  final Color color;
  const _SuasanaOption({
    required this.key,
    required this.label,
    required this.description,
    required this.emoji,
    required this.color,
  });
}

class QuotePromptGeneratorScreen extends ConsumerStatefulWidget {
  const QuotePromptGeneratorScreen({super.key});

  @override
  ConsumerState<QuotePromptGeneratorScreen> createState() =>
      _QuotePromptGeneratorScreenState();
}

class _QuotePromptGeneratorScreenState
    extends ConsumerState<QuotePromptGeneratorScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _quoteController = TextEditingController();
  final _authorController = TextEditingController();

  String _selectedSuasana = 'auto';
  String _selectedOrientation = _orientationOptions.first;
  bool _useCharacter = false;
  String? _selectedCharacterId;
  List<Character> _characters = [];
  bool _isLoadingOptions = true;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.04).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    _loadOptions();
  }

  Future<void> _loadOptions() async {
    setState(() => _isLoadingOptions = true);
    final repo = ref.read(appOptionsRepositoryProvider);
    final characters = await repo.getCharacters();
    if (mounted) {
      setState(() {
        final selectedStillExists = characters.any(
          (c) => c.id == _selectedCharacterId,
        );
        _characters = characters;
        _selectedCharacterId = characters.isEmpty
            ? null
            : (selectedStillExists
                  ? _selectedCharacterId
                  : characters.first.id);
        _isLoadingOptions = false;
      });
    }
  }

  @override
  void dispose() {
    _quoteController.dispose();
    _authorController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  _SuasanaOption get _selectedSuasanaData =>
      _suasanaOptions.firstWhere((s) => s.key == _selectedSuasana);

  String? _resolveCharacterImageUrl(String? imageUrl) {
    final trimmed = imageUrl?.trim();
    if (trimmed == null || trimmed.isEmpty) return null;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    final normalized = trimmed
        .replaceAll('\\', '/')
        .replaceFirst(RegExp(r'^/+'), '');
    return '${EnvConfig.baseUrl}/$normalized';
  }

  Future<void> _generate() async {
    if (!_formKey.currentState!.validate()) return;

    final String? moodOverride = _selectedSuasana == 'auto'
        ? null
        : _selectedSuasana;
    final selectedCharacterId = _useCharacter ? _selectedCharacterId : null;

    if (_useCharacter &&
        (selectedCharacterId == null ||
            !_characters.any((c) => c.id == selectedCharacterId))) {
      ToastMessage.showError(
        context,
        'Pilih karakter dulu, atau matikan opsi karakter.',
      );
      return;
    }

    await ref
        .read(promptProvider.notifier)
        .generateQuotePrompt(
          quoteText: _quoteController.text.trim(),
          quoteAuthor: _authorController.text.trim().isEmpty
              ? null
              : _authorController.text.trim(),
          characterId: selectedCharacterId,
          useCharacter: selectedCharacterId != null,
          imageOrientation: _selectedOrientation,
          moodOverride: moodOverride,
        );

    final state = ref.read(promptProvider);
    if (!mounted) return;

    if (state.generatedPrompt != null && state.errorMessage == null) {
      context.replace('/prompt/${state.generatedPrompt!.id}');
    } else if (state.errorMessage != null) {
      ToastMessage.showError(context, state.errorMessage!);
    }
  }

  @override
  Widget build(BuildContext context) {
    final promptState = ref.watch(promptProvider);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final suasana = _selectedSuasanaData;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Generator Kata Mutiara'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Judul Modern ────────────────────────────────────────────
                Text(
                  'Buat Kata Mutiara',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 24),

                // ── Input Kata Mutiara ─────────────────────────────────────
                _buildSectionLabel(theme, '✍️ Kata Mutiara', required: true),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _quoteController,
                  maxLines: 4,
                  maxLength: 300,
                  decoration: InputDecoration(
                    hintText:
                        'Tulis kata mutiara di sini...\nmisal: "Bahkan aku sempat merencanakan nanti begini, abis itu begitu, nah setelah ini begini..."',
                    hintStyle: TextStyle(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.4),
                      fontSize: 14,
                      height: 1.5,
                    ),
                    alignLabelWithHint: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                    contentPadding: const EdgeInsets.all(16),
                  ),
                  validator: (v) {
                    if (v == null || v.trim().isEmpty) {
                      return 'Kata mutiara wajib diisi';
                    }
                    if (v.trim().length < 5) {
                      return 'Minimal 5 karakter';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),

                // ── Nama Penulis/Sumber ─────────────────────────────────────
                _buildSectionLabel(
                  theme,
                  '👤 Penulis / Sumber (Opsional)',
                  required: false,
                ),
                const SizedBox(height: 10),
                TextFormField(
                  controller: _authorController,
                  decoration: InputDecoration(
                    hintText: 'misal: Pramoedya Ananta Toer',
                    prefixIcon: const Icon(Icons.person_outline_rounded),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // ── Pemilihan Suasana ──────────────────────────────────────
                _buildSectionLabel(
                  theme,
                  '🌈 Pilih Suasana / Atmosfer',
                  required: true,
                ),
                const SizedBox(height: 6),
                Text(
                  'Suasana menentukan jenis pemandangan latar belakang foto sinematik.',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                  ),
                ),
                const SizedBox(height: 12),
                _buildSuasanaGrid(theme, isDark),
                const SizedBox(height: 24),

                // ── Orientasi Gambar ───────────────────────────────────────
                _buildSectionLabel(
                  theme,
                  '📐 Ukuran & Orientasi Gambar',
                  required: false,
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  isExpanded: true,
                  initialValue: _selectedOrientation,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.aspect_ratio_rounded),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  items: _orientationOptions.map((o) {
                    return DropdownMenuItem(
                      value: o,
                      child: Text(o, overflow: TextOverflow.ellipsis),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() => _selectedOrientation = val);
                    }
                  },
                ),
                const SizedBox(height: 24),

                _buildSectionTitle(theme, 'Pesan & Suasana'),
                _buildModernToggle(
                  theme,
                  title: 'Gunakan Karakter AI',
                  subtitle: 'Sisipkan karakter lucu di pojok bawah',
                  value: _useCharacter,
                  onChanged: (val) => setState(() => _useCharacter = val),
                  icon: Icons.person_pin_rounded,
                ),
                if (_useCharacter) ...[
                  const SizedBox(height: 12),
                  _buildVisualCharacterSelector(theme),
                ],
                const SizedBox(height: 24),
                _buildGenerateButton(theme, promptState, isDark, suasana),
                const SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }


  // ─── Header Banner ──────────────────────────────────────────────────────
  Widget _buildHeaderBanner(
    ThemeData theme,
    bool isDark,
    _SuasanaOption suasana,
    PromptState promptState,
  ) {
    return AnimatedBuilder(
      animation: _pulseAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: promptState.isGenerating ? _pulseAnimation.value : 1.0,
          child: child,
        );
      },
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [suasana.color, suasana.color.withValues(alpha: 0.6)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: suasana.color.withValues(alpha: 0.35),
              blurRadius: 20,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(suasana.emoji, style: const TextStyle(fontSize: 36)),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Generator Kata Mutiara',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Foto sinematik + karakter lucu seperti Patrick, SpongeBob, dll',
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: Colors.white.withValues(alpha: 0.85),
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(100),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.auto_awesome_rounded,
                    size: 14,
                    color: Colors.white,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Powered by Groq AI · Caption TikTok + 5 Hashtag',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Section Label ─────────────────────────────────────────────────────
  Widget _buildSectionLabel(
    ThemeData theme,
    String label, {
    required bool required,
  }) {
    return Row(
      children: [
        Text(
          label,
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
        ),
        if (required) ...[
          const SizedBox(width: 4),
          Text(
            '*',
            style: TextStyle(
              color: theme.colorScheme.error,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ],
    );
  }

  // ─── Suasana Grid ──────────────────────────────────────────────────────
  Widget _buildSuasanaGrid(ThemeData theme, bool isDark) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 2.2,
      ),
      itemCount: _suasanaOptions.length,
      itemBuilder: (context, idx) {
        final opt = _suasanaOptions[idx];
        final isSelected = opt.key == _selectedSuasana;

        return GestureDetector(
          onTap: () => setState(() => _selectedSuasana = opt.key),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            decoration: BoxDecoration(
              color: isSelected
                  ? opt.color.withValues(alpha: isDark ? 0.25 : 0.12)
                  : (isDark ? AppColors.darkSurface : Colors.white),
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: isSelected
                    ? opt.color
                    : (isDark ? AppColors.darkBorder : AppColors.lightBorder),
                width: isSelected ? 2 : 1,
              ),
              boxShadow: isSelected
                  ? [
                      BoxShadow(
                        color: opt.color.withValues(alpha: 0.2),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ]
                  : [],
            ),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              child: Row(
                children: [
                  Text(opt.emoji, style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          opt.label.replaceFirst(RegExp(r'^.{2}\s'), ''),
                          style: theme.textTheme.labelSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: isSelected
                                ? opt.color
                                : theme.colorScheme.onSurface,
                            fontSize: 11,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          opt.description,
                          style: theme.textTheme.labelSmall?.copyWith(
                            fontSize: 9,
                            color: theme.colorScheme.onSurface.withValues(
                              alpha: 0.55,
                            ),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildVisualCharacterSelector(ThemeData theme) {
    if (_characters.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(vertical: 16),
        child: Text(
          'Belum ada karakter di database.',
          style: TextStyle(color: Colors.redAccent),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 8),
        SizedBox(
          height: 140,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _characters.length,
            itemBuilder: (context, index) {
              final character = _characters[index];
              final isSelected = _selectedCharacterId == character.id;
              final imageUrl = character.imageUrl != null
                  ? _resolveCharacterImageUrl(character.imageUrl)
                  : null;

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedCharacterId = character.id;
                  });
                },
                child: Container(
                  width: 100,
                  margin: const EdgeInsets.only(right: 12),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? theme.colorScheme.primaryContainer.withValues(alpha: 0.1)
                        : theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? theme.colorScheme.primary : Colors.grey.withValues(alpha: 0.2),
                      width: isSelected ? 2 : 1,
                    ),
                    boxShadow: isSelected
                        ? [BoxShadow(color: theme.colorScheme.primary.withValues(alpha: 0.15), blurRadius: 8, offset: const Offset(0, 4))]
                        : [],
                  ),
                  child: Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Expanded(
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: imageUrl != null
                                    ? CachedNetworkImage(
                                        imageUrl: imageUrl,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        errorWidget: (_, __, ___) => _buildDefaultCharAvatar(theme),
                                      )
                                    : _buildDefaultCharAvatar(theme),
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              character.name.split(' (')[0],
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                                color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurface,
                              ),
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      Positioned(
                        top: 4,
                        right: 4,
                        child: GestureDetector(
                          onTap: () => _showCharacterZoomModal(character, theme),
                          child: Container(
                            padding: const EdgeInsets.all(3),
                            decoration: const BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.zoom_in_rounded,
                              size: 14,
                              color: Colors.white,
                            ),
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
      ],
    );
  }

  Widget _buildDefaultCharAvatar(ThemeData theme) {
    return Container(
      color: theme.colorScheme.primaryContainer,
      child: Icon(Icons.person, color: theme.colorScheme.onPrimaryContainer, size: 28),
    );
  }

  Widget _buildSelectedCharacterPreviewCard(ThemeData theme) {
    if (_selectedCharacterId == null) return const SizedBox.shrink();
    final character = _characters.firstWhere(
      (c) => c.id == _selectedCharacterId,
      orElse: () => _characters.first,
    );
    final imageUrl = _resolveCharacterImageUrl(character.imageUrl);

    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (imageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: imageUrl,
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                  errorWidget: (_, _, _) => Container(
                    width: 50,
                    height: 50,
                    color: Colors.grey[200],
                    child: const Icon(Icons.person, color: Colors.grey),
                  ),
                ),
              )
            else
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.person,
                  color: theme.colorScheme.onPrimaryContainer,
                ),
              ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    character.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Karakter akan diposisikan kecil di pojok bawah gambar membelakangi kamera.',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showCharacterZoomModal(Character character, ThemeData theme) {
    final imageUrl = _resolveCharacterImageUrl(character.imageUrl);

    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
          ),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Stack(
                  children: [
                    if (imageUrl != null)
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(24),
                        ),
                        child: Container(
                          color: theme.colorScheme.onSurface.withValues(
                            alpha: 0.05,
                          ),
                          child: CachedNetworkImage(
                            imageUrl: imageUrl,
                            height: 320,
                            width: double.infinity,
                            fit: BoxFit.contain,
                            errorWidget: (_, _, _) => Container(
                              height: 320,
                              color: Colors.grey[200],
                              child: const Icon(
                                Icons.person,
                                size: 80,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ),
                      )
                    else
                      Container(
                        height: 320,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primaryContainer,
                          borderRadius: const BorderRadius.vertical(
                            top: Radius.circular(24),
                          ),
                        ),
                        child: Icon(
                          Icons.person,
                          size: 80,
                          color: theme.colorScheme.onPrimaryContainer,
                        ),
                      ),
                    Positioned(
                      top: 12,
                      right: 12,
                      child: GestureDetector(
                        onTap: () => Navigator.pop(context),
                        child: Container(
                          padding: const EdgeInsets.all(6),
                          decoration: const BoxDecoration(
                            color: Colors.black54,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.close,
                            size: 18,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        character.name,
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        character.prompt,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurface.withValues(
                            alpha: 0.6,
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () => Navigator.pop(context),
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Tutup'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ─── Generate Button ───────────────────────────────────────────────────
  Widget _buildGenerateButton(
    ThemeData theme,
    PromptState promptState,
    bool isDark,
    _SuasanaOption suasana,
  ) {
    return AnimatedScale(
      scale: promptState.isGenerating ? 0.97 : 1.0,
      duration: const Duration(milliseconds: 200),
      child: Container(
        width: double.infinity,
        height: 58,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: LinearGradient(
            colors: promptState.isGenerating
                ? [
                    suasana.color.withValues(alpha: 0.6),
                    suasana.color.withValues(alpha: 0.4),
                  ]
                : [suasana.color, suasana.color.withValues(alpha: 0.7)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: promptState.isGenerating
              ? []
              : [
                  BoxShadow(
                    color: suasana.color.withValues(alpha: 0.4),
                    blurRadius: 18,
                    offset: const Offset(0, 8),
                  ),
                ],
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(18),
            onTap: promptState.isGenerating ? null : _generate,
            child: Center(
              child: promptState.isGenerating
                  ? Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Text(
                          'AI sedang membuat prompt foto sinematik...',
                          style: theme.textTheme.titleSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.auto_awesome_rounded,
                          color: Colors.white,
                          size: 22,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Generate',
                          style: theme.textTheme.titleSmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4, top: 24),
      child: Text(
        title.toUpperCase(),
        style: theme.textTheme.labelLarge?.copyWith(
          fontWeight: FontWeight.bold,
          color: theme.colorScheme.primary.withValues(alpha: 0.7),
          letterSpacing: 1.2,
          fontSize: 12,
        ),
      ),
    );
  }

  Widget _buildModernToggle(
    ThemeData theme, {
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: value
              ? theme.colorScheme.primary.withValues(alpha: 0.4)
              : theme.colorScheme.outline.withValues(alpha: 0.1),
        ),
      ),
      child: ListTile(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        onTap: () => onChanged(!value),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: value
                ? theme.colorScheme.primary.withValues(alpha: 0.1)
                : theme.colorScheme.outline.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            size: 20,
            color: value ? theme.colorScheme.primary : theme.colorScheme.onSurface.withValues(alpha: 0.4),
          ),
        ),
        title: Text(
          title,
          style: theme.textTheme.titleSmall?.copyWith(
            fontWeight: FontWeight.bold,
            color: value ? theme.colorScheme.primary : null,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: theme.textTheme.bodySmall?.copyWith(fontSize: 11),
        ),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeColor: theme.colorScheme.primary,
        ),
      ),
    );
  }
}
