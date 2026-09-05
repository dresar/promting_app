import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:promting_app/providers/template_provider.dart';
import 'package:promting_app/data/models/template.dart';
import 'package:promting_app/widgets/toast_message.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:image_picker/image_picker.dart';
import 'package:promting_app/data/models/prompt_history.dart' show PromptSlide;

class TemplateDetailScreen extends ConsumerStatefulWidget {
  final String id;

  const TemplateDetailScreen({super.key, required this.id});

  @override
  ConsumerState<TemplateDetailScreen> createState() => _TemplateDetailScreenState();
}

class _TemplateDetailScreenState extends ConsumerState<TemplateDetailScreen> {
  Template? _template;
  bool _isLoading = true;

  String _getFullImageUrl(String path) {
    if (path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return '${EnvConfig.baseUrl}/$cleanPath';
  }

  int _currentImageIndex = 0;
  final PageController _imagePageController = PageController();

  @override
  void initState() {
    super.initState();
    _fetchDetail();
  }

  @override
  void dispose() {
    _imagePageController.dispose();
    super.dispose();
  }

  Future<void> _fetchDetail() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final data = await ref.read(templateProvider.notifier).fetchTemplateDetail(widget.id);
      setState(() {
        _template = data;
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _delete() async {
    if (_template == null) return;
    await ref.read(templateProvider.notifier).deleteTemplate(_template!.id);
    if (mounted) {
      context.pop();
    }
  }

  Future<void> _uploadImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(promptRepositoryProvider);
      final bytes = await pickedFile.readAsBytes();
      final imageUrl = await repo.uploadImage(
        pickedFile.path,
        bytes: bytes,
        fileName: pickedFile.name,
      );

      // Parse current images from thumbnailUrl
      List<String> currentImages = [];
      if (_template!.thumbnailUrl != null && _template!.thumbnailUrl!.isNotEmpty) {
        try {
          if (_template!.thumbnailUrl!.startsWith('[')) {
            final List<dynamic> decoded = jsonDecode(_template!.thumbnailUrl!);
            currentImages = decoded.map((e) => e.toString()).toList();
          } else {
            currentImages.add(_template!.thumbnailUrl!);
          }
        } catch (_) {
          currentImages.add(_template!.thumbnailUrl!);
        }
      }

      currentImages.add(imageUrl);

      // Call updateTemplate
      final templateRepo = ref.read(templateProvider.notifier);
      await templateRepo.updateTemplate(
        id: _template!.id,
        title: _template!.title,
        content: _template!.content,
        categoryId: _template!.categoryId,
        description: _template!.description,
        thumbnailUrl: jsonEncode(currentImages),
        isPremium: _template!.isPremium,
      );

      await _fetchDetail();
      if (mounted) {
        ToastMessage.showSuccess(context, 'Gambar berhasil ditambahkan ke template.');
      }
    } catch (e) {
      if (mounted) {
        ToastMessage.showError(context, 'Gagal menambahkan gambar: $e');
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
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
                  _getFullImageUrl(imageUrl),
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
    final theme = Theme.of(context);

    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_template == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Template')),
        body: const Center(
          child: Text('Template tidak ditemukan.'),
        ),
      );
    }

    // Parse images
    List<String> imageUrls = [];
    if (_template!.thumbnailUrl != null && _template!.thumbnailUrl!.isNotEmpty) {
      try {
        if (_template!.thumbnailUrl!.startsWith('[')) {
          final List<dynamic> decoded = jsonDecode(_template!.thumbnailUrl!);
          imageUrls = decoded.map((e) => e.toString()).where((s) => s.isNotEmpty).toList();
        } else {
          imageUrls.add(_template!.thumbnailUrl!);
        }
      } catch (e) {
        imageUrls.add(_template!.thumbnailUrl!);
      }
    }

    // Parse slides
    List<PromptSlide> structuredSlides = [];
    List<String> rawSlides = [];
    String instagramCaption = '';
    String tiktokCaption = '';
    String hashtags = '';
    bool hasStructuredSlides = false;

    final String rawContent = _template!.content.trim();
    if (rawContent.startsWith('{')) {
      try {
        final decoded = jsonDecode(rawContent);
        instagramCaption = decoded['instagramCaption'] as String? ?? '';
        tiktokCaption = decoded['tiktokCaption'] as String? ?? '';
        hashtags = decoded['hashtags'] as String? ?? '';
        
        if (decoded['slides'] != null) {
          final List<dynamic> slidesList = decoded['slides'] as List<dynamic>;
          structuredSlides = slidesList.map((e) => PromptSlide.fromJson(e as Map<String, dynamic>)).toList();
          hasStructuredSlides = true;
        } else if (decoded['rawText'] != null) {
          final String rawText = decoded['rawText'] as String;
          if (rawText.trim().startsWith('[')) {
            final decodedArray = jsonDecode(rawText);
            if (decodedArray is List) {
              structuredSlides = decodedArray.map((e) => PromptSlide.fromJson(e as Map<String, dynamic>)).toList();
              hasStructuredSlides = true;
            }
          } else {
            final separatorRegex = RegExp(r'(?=--- Slide \d+ ---|Slide \d+:)');
            rawSlides = rawText
                .split(separatorRegex)
                .where((s) => s.trim().isNotEmpty)
                .toList();
          }
        }
      } catch (_) {
        final separatorRegex = RegExp(r'(?=--- Slide \d+ ---|Slide \d+:)');
        rawSlides = _template!.content
            .split(separatorRegex)
            .where((s) => s.trim().isNotEmpty)
            .toList();
      }
    } else if (rawContent.startsWith('[')) {
      try {
        final decoded = jsonDecode(rawContent);
        if (decoded is List) {
          structuredSlides = decoded.map((e) => PromptSlide.fromJson(e as Map<String, dynamic>)).toList();
          hasStructuredSlides = true;
        }
      } catch (_) {
        final separatorRegex = RegExp(r'(?=--- Slide \d+ ---|Slide \d+:)');
        rawSlides = _template!.content
            .split(separatorRegex)
            .where((s) => s.trim().isNotEmpty)
            .toList();
      }
    } else {
      final separatorRegex = RegExp(r'(?=--- Slide \d+ ---|Slide \d+:)');
      rawSlides = _template!.content
          .split(separatorRegex)
          .where((s) => s.trim().isNotEmpty)
          .toList();
    }

    final int totalSlidesCount = hasStructuredSlides ? structuredSlides.length : rawSlides.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(_template!.title),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded),
            onPressed: _delete,
          ),
        ],
      ),
      body: SafeArea(
        child: _template!.content.isEmpty
            ? const Center(child: Text('Konten template kosong'))
            : ListView(
                padding: const EdgeInsets.all(20.0),
                children: [
                  // Image Gallery & Upload Section
                  if (imageUrls.isEmpty) ...[
                    GestureDetector(
                      onTap: _uploadImage,
                      child: Container(
                        height: 180,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: theme.colorScheme.primary.withValues(alpha: 0.2),
                            width: 1.5,
                          ),
                        ),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_photo_alternate_rounded, size: 48, color: Colors.grey),
                            SizedBox(height: 8),
                            Text('Belum ada gambar. Ketuk untuk menambah gambar.', style: TextStyle(color: Colors.grey, fontSize: 13)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                  ] else ...[
                    SizedBox(
                      height: 220,
                      child: PageView.builder(
                        controller: _imagePageController,
                        itemCount: imageUrls.length,
                        onPageChanged: (i) => setState(() => _currentImageIndex = i),
                        itemBuilder: (context, index) {
                          return GestureDetector(
                            onTap: () => _showZoomDialog(context, imageUrls[index]),
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 4),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                              ),
                              clipBehavior: Clip.antiAlias,
                              child: Stack(
                                fit: StackFit.expand,
                                children: [
                                  Image.network(
                                    _getFullImageUrl(imageUrls[index]),
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(
                                      color: theme.colorScheme.primary.withValues(alpha: 0.05),
                                      child: const Center(
                                        child: Icon(Icons.broken_image, size: 50, color: Colors.grey),
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    bottom: 8,
                                    right: 8,
                                    child: Container(
                                      padding: const EdgeInsets.all(6),
                                      decoration: BoxDecoration(
                                        color: Colors.black45,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(Icons.zoom_in, color: Colors.white, size: 18),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Dots indicators
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: List.generate(
                            imageUrls.length > 5 ? imageUrls.length : 5,
                            (i) => Container(
                              width: _currentImageIndex == i ? 12 : 6,
                              height: 6,
                              margin: const EdgeInsets.symmetric(horizontal: 3),
                              decoration: BoxDecoration(
                                color: _currentImageIndex == i
                                    ? Colors.white
                                    : Colors.white.withValues(alpha: 0.4),
                                borderRadius: BorderRadius.circular(3),
                              ),
                            ),
                          ),
                        ),
                        // Add Image Button
                        TextButton.icon(
                          onPressed: _uploadImage,
                          icon: const Icon(Icons.add_photo_alternate_rounded, size: 18),
                          label: const Text('Tambah Gambar'),
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                  ],

                  // Title
                  Text(
                    _template!.title,
                    style: theme.textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.onSurface,
                    ),
                  ),
                  const SizedBox(height: 8),

                  // Description
                  if (_template!.description != null && _template!.description!.isNotEmpty) ...[
                    Text(
                      _template!.description!,
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Slides content
                  if (hasStructuredSlides) ...[
                    ...List.generate(structuredSlides.length, (index) {
                      final slide = structuredSlides[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: _buildStructuredSlideCard(theme, slide, index, totalSlidesCount),
                      );
                    }),
                  ] else ...[
                    ...List.generate(rawSlides.length, (index) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Card(
                          elevation: 0,
                          color: theme.colorScheme.surface,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: BorderSide(
                              color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5),
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: theme.colorScheme.primary.withValues(alpha: 0.1),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Text(
                                        '${index + 1}/$totalSlidesCount',
                                        style: TextStyle(
                                          color: theme.colorScheme.primary,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                    IconButton(
                                      icon: const Icon(Icons.copy_rounded, size: 20),
                                      tooltip: 'Salin Slide Ini',
                                      onPressed: () {
                                        Clipboard.setData(ClipboardData(text: rawSlides[index].trim()));
                                        ToastMessage.showSuccess(context, 'Slide ${index + 1} disalin ke clipboard.');
                                      },
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                SelectableText(
                                  rawSlides[index].trim(),
                                  style: theme.textTheme.bodyLarge?.copyWith(
                                    fontFamily: 'monospace',
                                    height: 1.6,
                                    fontSize: 16,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                  ],

                  // Caption & Hashtags Section at the bottom
                  if (instagramCaption.isNotEmpty || tiktokCaption.isNotEmpty || hashtags.isNotEmpty)
                    _buildCaptionSection(theme, instagramCaption, tiktokCaption, hashtags),
                ],
              ),
      ),
    );
  }

  Widget _buildStructuredSlideCard(ThemeData theme, PromptSlide slide, int index, int total) {
    return Card(
      elevation: 0,
      color: theme.colorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${index + 1}/$total',
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.copy_rounded, size: 20),
                  tooltip: 'Salin Slide Ini',
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: slide.toCopyText()));
                    ToastMessage.showSuccess(context, 'Slide ${index + 1} disalin.');
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (slide.instruksiAwalWajib.isNotEmpty) ...[
              Text('Instruksi Awal Wajib:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              SelectableText(slide.instruksiAwalWajib, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 12),
            ],
            if (slide.peran.isNotEmpty) ...[
              Text('Peran/Role:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              SelectableText(slide.peran, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 12),
            ],
            if (slide.gayaDominan.isNotEmpty) ...[
              Text('Gaya Dominan:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              SelectableText(slide.gayaDominan, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 12),
            ],
            if (slide.deskripsiVisual.isNotEmpty) ...[
              Text('Deskripsi Visual:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              SelectableText(slide.deskripsiVisual, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 12),
            ],
            if (slide.headline.isNotEmpty || slide.subtext.isNotEmpty || slide.detail.isNotEmpty) ...[
              Text('Teks dalam Gambar:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: theme.colorScheme.outlineVariant.withValues(alpha: 0.5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (slide.headline.isNotEmpty) ...[
                      Text('Headline:', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.grey)),
                      SelectableText(slide.headline, style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                    ],
                    if (slide.subtext.isNotEmpty) ...[
                      Text('Subtext:', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.grey)),
                      SelectableText(slide.subtext, style: theme.textTheme.bodyMedium),
                      const SizedBox(height: 8),
                    ],
                    if (slide.detail.isNotEmpty) ...[
                      Text('Detail:', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.grey)),
                      SelectableText(slide.detail, style: theme.textTheme.bodyMedium),
                      const SizedBox(height: 8),
                    ],
                    if (slide.microTip.isNotEmpty) ...[
                      Text('Micro Tip:', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.grey)),
                      SelectableText(slide.microTip, style: theme.textTheme.bodyMedium?.copyWith(fontStyle: FontStyle.italic)),
                    ],
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],
            if (slide.mediaSosialAturan.isNotEmpty) ...[
              Text('Aturan Media Sosial & Watermark:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              SelectableText(slide.mediaSosialAturan, style: theme.textTheme.bodyMedium),
              const SizedBox(height: 12),
            ],
            if (slide.negativePrompt.isNotEmpty) ...[
              Text('Negative Prompt:', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.redAccent)),
              const SizedBox(height: 4),
              SelectableText(slide.negativePrompt, style: theme.textTheme.bodyMedium?.copyWith(color: Colors.redAccent[700])),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCaptionSection(ThemeData theme, String igCaption, String ttCaption, String hts) {
    const igColor = Color(0xFFE1306C);
    const ttColor = Color(0xFF69C9D0);
    const hashColor = Color(0xFF6366F1);

    return Container(
      margin: const EdgeInsets.only(top: 12, bottom: 20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [igColor.withValues(alpha: 0.06), ttColor.withValues(alpha: 0.04)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: igColor.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 4),
            child: Row(
              children: [
                const Icon(Icons.auto_awesome_rounded, color: igColor, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Caption & Hashtag Media Sosial',
                  style: theme.textTheme.labelLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: igColor,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          if (igCaption.isNotEmpty)
            _buildCaptionTile(theme, '📸 Instagram Caption', igCaption, igColor),
          if (ttCaption.isNotEmpty)
            _buildCaptionTile(theme, '🎵 TikTok Caption', ttCaption, ttColor),
          if (hts.isNotEmpty)
            _buildCaptionTile(theme, '# Hashtags', hts, hashColor),
        ],
      ),
    );
  }

  Widget _buildCaptionTile(ThemeData theme, String label, String value, Color color) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
              InkWell(
                onTap: () {
                  Clipboard.setData(ClipboardData(text: value));
                  ToastMessage.showSuccess(context, '$label disalin!');
                },
                child: Row(
                  children: [
                    Icon(Icons.copy_rounded, size: 13, color: color),
                    const SizedBox(width: 4),
                    Text('Salin', style: TextStyle(fontSize: 11, color: color)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          SelectableText(value, style: theme.textTheme.bodyMedium?.copyWith(height: 1.55)),
        ],
      ),
    );
  }
}
