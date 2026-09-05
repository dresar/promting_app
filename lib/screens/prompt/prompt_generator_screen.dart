import 'dart:typed_data';
import 'package:promting_app/core/utils/web_helper.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import 'package:gal/gal.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/custom_button.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/widgets/toast_message.dart';

import 'package:promting_app/data/models/character.dart';

// ─── Jenis konten khusus promting gambar edukasi ───────────────────────────
const _contentTypes = [
  'Edukasi Instagram',
  'Carousel Post Instagram',
  'Edukasi TikTok',
  'Thumbnail YouTube',
  'Story Instagram / TikTok',
  'Banner Twitter / X',
  'Infografis LinkedIn',
  'Post Facebook Edukasi',
];

// ─── Opsi warna latar ─────────────────────────────────────────────────────
const _backgroundOptions = [
  _BgOption(label: 'Putih Bersih', value: 'white background, clean white'),
  _BgOption(label: 'Hitam Premium', value: 'black background, dark premium'),
  _BgOption(label: 'Gradien Ungu-Biru', value: 'purple to blue gradient background'),
  _BgOption(label: 'Gradien Oranye-Merah', value: 'orange to red gradient background'),
  _BgOption(label: 'Gradien Hijau-Teal', value: 'green to teal gradient background'),
  _BgOption(label: 'Gradien Pink-Ungu', value: 'pink to purple gradient background'),
  _BgOption(label: 'Gradien Biru-Cyan', value: 'blue to cyan gradient background'),
  _BgOption(label: 'Gradien Emas-Kuning', value: 'gold to yellow gradient background'),
  _BgOption(label: 'Abu-abu Soft', value: 'soft gray background, neutral'),
  _BgOption(label: 'Gelap Neon', value: 'dark background with neon glow accent'),
];

// ─── Opsi Orientasi ───────────────────────────────────────────────────────
const _orientationOptions = [
  'Instagram Potret (3:4) - Canvas: 1080 × 1440 px',
  'Persegi (Square 1:1)',
  'Potret (Portrait 4:5)',
  'Lanskap (Landscape 16:9)',
];

// ─── Aturan wajib AI ──────────────────────────────────────────────────────
const _mandatoryRulesEdukasi = [
  '🗣️ Bahasa non-formal & santai — bicara kayak teman, bukan dosen',
  '✅ Teks dominan — isi slide lebih banyak teks, bukan gambar/vektor',
  '💡 Tiap slide punya 1 poin utama yang jelas & singkat',
  '🚫 Bebas dari promosi, harga, diskon, atau jualan',
  '🔥 Hook kuat di slide 1 — bikin penasaran & wajib lanjut baca',
  '📖 Istilah: edukasi, insight, fakta menarik, tips praktis, info penting',
  '🎯 Penutup: ajak save, share, dan follow',
];

const _mandatoryRulesIklan = [
  '🎯 Bahasa persuasif & urgency tinggi — bikin audiens mau action sekarang',
  '✅ Teks dominan — headline kuat + benefit jelas di tiap slide',
  '💰 Menonjolkan penawaran utama, harga/diskon (jika ada) secara berani',
  '🔥 Hook di slide 1 harus langsung "nembak" masalah audiens',
  '📢 Istilah: promo terbatas, stok mepet, harga spesial, daftar sekarang',
  '⚡ CTA tegas di slide terakhir — arahkan ke WA/link/beli sekarang',
  '🚀 Tone: semangat, confident, solutif — bukan memaksa',
];

class _BgOption {
  final String label;
  final String value;
  const _BgOption({required this.label, required this.value});
}

class PromptGeneratorScreen extends ConsumerStatefulWidget {
  const PromptGeneratorScreen({super.key});

  @override
  ConsumerState<PromptGeneratorScreen> createState() => _PromptGeneratorScreenState();
}

class _PromptGeneratorScreenState extends ConsumerState<PromptGeneratorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();

  String _selectedContentType = _contentTypes.first;
  String? _selectedDesignStyleId;
  String? _selectedDesignStyleName;
  String? _selectedAudienceId;
  String? _selectedAudienceName;
  String _selectedBackground = _backgroundOptions.first.value;
  String _selectedOrientation = _orientationOptions.first;
  int _slideCount = 5;
  bool _includeCaption = true;
  bool _showRulesCard = false;

  List<TargetAudience> _audiences = [];
  List<DesignStyle> _designStyles = [];
  List<Character> _characters = [];
  String? _selectedCharacterId;
  bool _useCharacter = false;
  bool _isLoadingOptions = true;

  bool get _isPromoContent {
    final lower = _selectedContentType.toLowerCase();
    return (lower.contains('iklan') ||
        lower.contains('promo') ||
        lower.contains('showcase') ||
        lower.contains('ads')) &&
        !lower.contains('edukasi');
  }

  @override
  void initState() {
    super.initState();
    _loadOptions();
  }

  Future<void> _loadOptions() async {
    setState(() => _isLoadingOptions = true);
    final repo = ref.read(appOptionsRepositoryProvider);
    final audiences = await repo.getTargetAudiences();
    // Gunakan gaya visual (design styles) saja untuk edukasi
    final styles = await repo.getDesignStyles();
    final characters = await repo.getCharacters();
    if (mounted) {
      setState(() {
        _audiences = audiences;
        _designStyles = styles;
        _characters = characters;
        if (audiences.isNotEmpty) {
          _selectedAudienceId = audiences.first.id;
          _selectedAudienceName = audiences.first.name;
        }
        if (styles.isNotEmpty) {
          _selectedDesignStyleId = styles.first.id;
          _selectedDesignStyleName = styles.first.name;
        }
        if (characters.isNotEmpty) {
          _selectedCharacterId = characters.first.id;
        }
        _isLoadingOptions = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  Future<void> _generate() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedAudienceName == null || _selectedDesignStyleName == null) {
      ToastMessage.showError(context, 'Pilih Target Audiens dan Gaya Desain terlebih dahulu.');
      return;
    }

    final bgLabel = _backgroundOptions.firstWhere(
      (b) => b.value == _selectedBackground,
      orElse: () => _backgroundOptions.first,
    ).label;

    await ref.read(promptProvider.notifier).generatePrompt(
      title: _titleController.text.trim(),
      contentType: _selectedContentType,
      slideCount: _slideCount,
      designStyle: '$_selectedDesignStyleName | Orientasi: $_selectedOrientation',
      targetAudience: _selectedAudienceName!,
      imageOrientation: _selectedOrientation,
      includeCaption: _includeCaption,
      characterId: _useCharacter ? _selectedCharacterId : null,
      useCharacter: _useCharacter,
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

    return Scaffold(
      appBar: AppBar(
        title: const Text('Generator Prompa Edukasi'),
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
                Text(
                  'Buat Prompt Edukasi',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),

                _buildSectionTitle(theme, 'Judul / Topik'),
                CustomTextField(
                  controller: _titleController,
                  labelText: 'Judul Konten',
                  hintText: 'misal: 5 Cara Belajar Coding',
                  prefixIcon: Icons.title_rounded,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) return 'Judul wajib diisi';
                    if (value.trim().length < 3) return 'Judul minimal 3 karakter';
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                _buildSectionTitle(theme, 'Jenis & Jumlah Slide'),
                Row(
                  children: [
                    Expanded(
                      flex: 2,
                      child: DropdownButtonFormField<String>(
                        isExpanded: true,
                        value: _selectedContentType,
                        decoration: const InputDecoration(
                          labelText: 'Jenis Konten',
                          prefixIcon: Icon(Icons.photo_library_outlined),
                        ),
                        items: _contentTypes.map((type) {
                          return DropdownMenuItem(value: type, child: Text(type, overflow: TextOverflow.ellipsis));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedContentType = val);
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<int>(
                        value: _slideCount,
                        decoration: const InputDecoration(
                          labelText: 'Slide',
                          prefixIcon: Icon(Icons.filter_none_rounded),
                        ),
                        items: List.generate(10, (i) => i + 1).map((i) {
                          return DropdownMenuItem(value: i, child: Text('$i'));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) setState(() => _slideCount = val);
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                _buildSectionTitle(theme, 'Gaya Visual'),
                  SizedBox(
                    height: 140,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _designStyles.length,
                      itemBuilder: (context, index) {
                        final style = _designStyles[index];
                        final isSelected = _selectedDesignStyleId == style.id;
                        final resolvedImgUrl = style.imageUrl != null && style.imageUrl!.isNotEmpty
                            ? _resolveImageUrl(style.imageUrl)
                            : '';

                        return GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedDesignStyleId = style.id;
                              _selectedDesignStyleName = style.name;
                            });
                          },
                          child: Container(
                            width: 110,
                            margin: const EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? theme.colorScheme.primaryContainer.withOpacity(0.1)
                                  : theme.colorScheme.surface,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? theme.colorScheme.primary : Colors.grey.withOpacity(0.2),
                                width: isSelected ? 2 : 1,
                              ),
                              boxShadow: isSelected
                                  ? [BoxShadow(color: theme.colorScheme.primary.withOpacity(0.15), blurRadius: 8, offset: const Offset(0, 4))]
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
                                          child: resolvedImgUrl.isNotEmpty
                                              ? (resolvedImgUrl.startsWith('assets/')
                                                  ? Image.asset(resolvedImgUrl, fit: BoxFit.cover, width: double.infinity)
                                                  : Image.network(resolvedImgUrl, fit: BoxFit.cover, width: double.infinity, errorBuilder: (_, __, ___) => _buildPlaceholderIconLarge()))
                                              : _buildPlaceholderIconLarge(),
                                        ),
                                      ),
                                      const SizedBox(height: 6),
                                      Text(
                                        style.name,
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
                                    onTap: () {
                                      if (resolvedImgUrl.isNotEmpty) {
                                        _showZoomableImageDialog(context, resolvedImgUrl);
                                      }
                                    },
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
                const SizedBox(height: 20),


                _buildSectionTitle(theme, 'Konfigurasi Tambahan'),
                // Orientasi
                 DropdownButtonFormField<String>(
                  isExpanded: true,
                  value: _selectedOrientation,
                  decoration: const InputDecoration(
                    labelText: 'Orientasi Gambar',
                    prefixIcon: Icon(Icons.crop_rotate_rounded),
                  ),
                  items: _orientationOptions.map((o) {
                    return DropdownMenuItem(value: o, child: Text(o, overflow: TextOverflow.ellipsis));
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedOrientation = val);
                  },
                ),
                const SizedBox(height: 20),

                // Target Audiens
                if (!_isLoadingOptions)
                  DropdownButtonFormField<String>(
                    isExpanded: true,
                    value: _selectedAudienceId,
                    decoration: const InputDecoration(
                      labelText: 'Target Audiens',
                      prefixIcon: Icon(Icons.people_outline_rounded),
                    ),
                    items: _audiences.map((a) {
                      return DropdownMenuItem(value: a.id, child: Text(a.name, overflow: TextOverflow.ellipsis));
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        final found = _audiences.firstWhere((a) => a.id == val);
                        setState(() {
                          _selectedAudienceId = val;
                          _selectedAudienceName = found.name;
                        });
                      }
                    },
                    validator: (_) => _selectedAudienceId == null ? 'Pilih target audiens' : null,
                  ),
                const SizedBox(height: 24),

                _buildModernToggle(
                  theme,
                  title: 'Gunakan Karakter AI',
                  subtitle: 'Sisipkan karakter secara konsisten',
                  value: _useCharacter,
                  onChanged: (val) => setState(() => _useCharacter = val),
                  icon: Icons.person_pin_rounded,
                ),
                if (_useCharacter) ...[
                  const SizedBox(height: 12),
                  _buildVisualCharacterSelector(theme),
                ],
                const SizedBox(height: 12),

                _buildModernToggle(
                  theme,
                  title: 'Caption Media Sosial',
                  subtitle: 'Generate caption & hashtag otomatis',
                  value: _includeCaption,
                  onChanged: (val) => setState(() => _includeCaption = val),
                  icon: Icons.auto_awesome_rounded,
                ),
                const SizedBox(height: 32),

                CustomButton(
                  text: 'Generate',
                  isLoading: promptState.isGenerating,
                  onPressed: _generate,
                ),
                const SizedBox(height: 12),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ── Caption Toggle Card ─────────────────────────────────────────────────
  Widget _buildCaptionToggle(ThemeData theme) {
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _includeCaption
              ? const Color(0xFF6366F1).withValues(alpha: 0.4)
              : theme.colorScheme.outline.withValues(alpha: 0.2),
        ),
        boxShadow: _includeCaption
            ? [BoxShadow(color: const Color(0xFF6366F1).withValues(alpha: 0.08), blurRadius: 12)]
            : [],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _includeCaption
                    ? const Color(0xFF6366F1).withValues(alpha: 0.12)
                    : theme.colorScheme.outline.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.auto_awesome_rounded,
                size: 18,
                color: _includeCaption
                    ? const Color(0xFF6366F1)
                    : theme.colorScheme.onSurface.withValues(alpha: 0.4),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Generate Caption Media Sosial',
                    style: theme.textTheme.labelLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: _includeCaption
                          ? const Color(0xFF6366F1)
                          : theme.colorScheme.onSurface.withValues(alpha: 0.5),
                    ),
                  ),
                  Text(
                    _includeCaption
                        ? 'Caption Instagram, TikTok & hashtag akan di-generate'
                        : 'Caption tidak akan di-generate (lebih cepat)',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            ),
            Switch(
              value: _includeCaption,
              onChanged: (val) => setState(() => _includeCaption = val),
              activeColor: const Color(0xFF6366F1),
            ),
          ],
        ),
      ),
    );
  }

  String _resolveImageUrl(String? path) {
    if (path == null || path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path == 'assets/images/logo.png') return path;
    
    final normalized = path
        .replaceAll('\\', '/')
        .replaceFirst(RegExp(r'^/+'), '');
    return '${EnvConfig.baseUrl}/$normalized';
  }

  Widget _buildStyleImagePreviewMini(DesignStyle style) {
    final imgUrl = style.imageUrl;
    if (imgUrl != null && imgUrl.isNotEmpty) {
      final resolvedUrl = _resolveImageUrl(imgUrl);
      if (resolvedUrl.startsWith('assets/')) {
        return Image.asset(
          resolvedUrl,
          width: 24,
          height: 24,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _buildPlaceholderIconMini(),
        );
      } else {
        return Image.network(
          resolvedUrl,
          width: 24,
          height: 24,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _buildPlaceholderIconMini(),
        );
      }
    }
    return _buildPlaceholderIconMini();
  }

  Widget _buildPlaceholderIconMini() {
    return Container(
      width: 24,
      height: 24,
      color: Colors.grey.shade800,
      child: const Icon(Icons.brush, size: 12, color: Colors.white70),
    );
  }

  Widget _buildSelectedStylePreviewCard(ThemeData theme) {
    final selectedStyle = _designStyles.firstWhere(
      (s) => s.id == _selectedDesignStyleId,
      orElse: () => _designStyles.first,
    );
    final imgUrl = selectedStyle.imageUrl;
    final resolvedUrl = imgUrl != null && imgUrl.isNotEmpty ? _resolveImageUrl(imgUrl) : '';

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2)),
      ),
      padding: const EdgeInsets.all(12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () {
              if (resolvedUrl.isNotEmpty) {
                _showZoomableImageDialog(context, resolvedUrl);
              }
            },
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: SizedBox(
                width: 80,
                height: 80,
                child: resolvedUrl.isNotEmpty
                    ? (resolvedUrl.startsWith('assets/')
                        ? Image.asset(resolvedUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => _buildPlaceholderIconLarge())
                        : Image.network(resolvedUrl, fit: BoxFit.cover, errorBuilder: (_, __, ___) => _buildPlaceholderIconLarge()))
                    : _buildPlaceholderIconLarge(),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  selectedStyle.name,
                  style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 4),
                Text(
                  selectedStyle.description ?? 'Tidak ada deskripsi gaya visual.',
                  style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurface.withOpacity(0.7)),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showZoomableImageDialog(BuildContext context, String imgUrl) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Stack(
            alignment: Alignment.center,
            children: [
              GestureDetector(
                onTap: () => Navigator.of(context).pop(),
                child: Container(
                  width: double.infinity,
                  height: double.infinity,
                  color: Colors.black.withOpacity(0.85),
                ),
              ),
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: InteractiveViewer(
                  panEnabled: true,
                  boundaryMargin: const EdgeInsets.all(20),
                  minScale: 0.5,
                  maxScale: 4.0,
                  child: imgUrl.startsWith('assets/')
                      ? Image.asset(imgUrl, fit: BoxFit.contain)
                      : Image.network(imgUrl, fit: BoxFit.contain),
                ),
              ),
              Positioned(
                top: 16,
                right: 16,
                child: Row(
                  children: [
                    if (!imgUrl.startsWith('assets/'))
                      Material(
                        color: Colors.black.withOpacity(0.5),
                        shape: const CircleBorder(),
                        child: IconButton(
                          icon: const Icon(Icons.download_rounded, color: Colors.white, size: 28),
                          onPressed: () async {
                            try {
                              ToastMessage.showSuccess(context, 'Mendownload gambar...');
                                if (kIsWeb) {
                                  openWebPage(imgUrl);
                                  if (context.mounted) ToastMessage.showSuccess(context, 'Gambar dibuka di tab baru untuk disimpan.');
                                  return;
                                }
                              var response = await Dio().get(imgUrl, options: Options(responseType: ResponseType.bytes));
                              await Gal.putImageBytes(
                                Uint8List.fromList(response.data),
                                name: "prompa_${DateTime.now().millisecondsSinceEpoch}"
                              );
                              if (context.mounted) ToastMessage.showSuccess(context, 'Gambar tersimpan di Galeri');
                            } catch (e) {
                              if (context.mounted) ToastMessage.showError(context, 'Gagal mendownload: $e');
                            }
                          },
                        ),
                      ),
                    if (!imgUrl.startsWith('assets/')) const SizedBox(width: 12),
                    Material(
                      color: Colors.black.withOpacity(0.5),
                      shape: const CircleBorder(),
                      child: IconButton(
                        icon: const Icon(Icons.close_rounded, color: Colors.white, size: 28),
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildPlaceholderIconLarge() {
    return Container(
      width: 80,
      height: 80,
      color: Colors.grey.shade900,
      child: const Icon(Icons.palette_outlined, size: 32, color: Colors.white54),
    );
  }

  Widget _buildSelectedCharacterPreviewCard(ThemeData theme) {
    if (_selectedCharacterId == null) return const SizedBox.shrink();
    final character = _characters.firstWhere((c) => c.id == _selectedCharacterId, orElse: () => _characters.first);

    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (character.imageUrl != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  _resolveImageUrl(character.imageUrl),
                  width: 50,
                  height: 50,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
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
                child: Icon(Icons.person, color: theme.colorScheme.onPrimaryContainer),
              ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    character.name,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
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
                  ? _resolveImageUrl(character.imageUrl)
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
                        ? theme.colorScheme.primaryContainer.withOpacity(0.1)
                        : theme.colorScheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isSelected ? theme.colorScheme.primary : Colors.grey.withOpacity(0.2),
                      width: isSelected ? 2 : 1,
                    ),
                    boxShadow: isSelected
                        ? [BoxShadow(color: theme.colorScheme.primary.withOpacity(0.15), blurRadius: 8, offset: const Offset(0, 4))]
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
                                    ? Image.network(
                                        imageUrl,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        errorBuilder: (_, __, ___) => _buildDefaultCharAvatar(theme),
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

  void _showCharacterZoomModal(Character character, ThemeData theme) {
    final imageUrl = character.imageUrl != null
        ? _resolveImageUrl(character.imageUrl)
        : null;

    showDialog(
      context: context,
      builder: (context) {
        return Dialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Stack(
                  children: [
                    if (imageUrl != null)
                      ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                        child: Container(
                          color: theme.colorScheme.onSurface.withOpacity(0.05),
                          child: Image.network(
                            imageUrl,
                            height: 320,
                            width: double.infinity,
                            fit: BoxFit.contain,
                            errorBuilder: (_, __, ___) => Container(
                              height: 320,
                              color: Colors.grey[200],
                              child: const Icon(Icons.person, size: 80, color: Colors.grey),
                            ),
                          ),
                        ),
                      )
                    else
                      Container(
                        height: 320,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primaryContainer,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                        ),
                        child: Icon(Icons.person, size: 80, color: theme.colorScheme.onPrimaryContainer),
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
                          child: const Icon(Icons.close, color: Colors.white, size: 20),
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        character.name,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                      const SizedBox(height: 12),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.primary,
                          foregroundColor: theme.colorScheme.onPrimary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          minimumSize: const Size(double.infinity, 48),
                        ),
                        onPressed: () {
                          setState(() {
                            _selectedCharacterId = character.id;
                          });
                          Navigator.pop(context);
                        },
                        child: const Text('Pilih Karakter Ini', style: TextStyle(fontWeight: FontWeight.bold)),
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

  Widget _buildSectionTitle(ThemeData theme, String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
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
