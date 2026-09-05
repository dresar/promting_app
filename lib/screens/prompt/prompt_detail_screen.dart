import 'dart:convert';
import 'dart:typed_data';
import 'package:promting_app/core/utils/web_helper.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import 'package:gal/gal.dart';
import 'package:path_provider/path_provider.dart';

import 'package:promting_app/data/models/prompt_history.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/category_provider.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/toast_message.dart';
import 'package:promting_app/core/config/env_config.dart';

class PromptDetailScreen extends ConsumerStatefulWidget {
  final String id;

  const PromptDetailScreen({super.key, required this.id});

  @override
  ConsumerState<PromptDetailScreen> createState() => _PromptDetailScreenState();
}

class _PromptDetailScreenState extends ConsumerState<PromptDetailScreen> {
  PromptHistory? _detail;
  bool _isLoading = true;

  String _getFullImageUrl(String path) {
    if (path.isEmpty) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return '${EnvConfig.baseUrl}/$cleanPath';
  }

  @override
  void initState() {
    super.initState();
    _fetchDetail();
  }

  Future<void> _fetchDetail() async {
    setState(() {
      _isLoading = true;
    });
    try {
      final repo = ref.read(promptRepositoryProvider);
      final data = await repo.getPromptHistoryById(widget.id);
      setState(() {
        _detail = data;
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _copyJsonForChatGPT() {
    if (_detail == null) return;

    if (_detail!.hasStructuredSlides) {
      final List<Map<String, dynamic>> jsonList = _detail!.slides
          .map((s) => s.toJson())
          .toList();

      // Use JsonEncoder with indent for readable formatting
      final encoder = const JsonEncoder.withIndent('  ');
      final String copyText = encoder.convert(jsonList);

      Clipboard.setData(ClipboardData(text: copyText));
      ToastMessage.showSuccess(context, 'Seluruh JSON disalin.');
    } else {
      Clipboard.setData(ClipboardData(text: _detail!.generatedPrompt ?? ''));
      ToastMessage.showSuccess(context, 'Teks mentah disalin.');
    }
  }

  Future<void> _toggleFavorite() async {
    if (_detail == null) return;
    final favNow = _detail!.isFavorite;
    await ref.read(promptProvider.notifier).toggleFavorite(_detail!.id, favNow);
    setState(() {
      _detail = PromptHistory(
        id: _detail!.id,
        userId: _detail!.userId,
        title: _detail!.title,
        contentType: _detail!.contentType,
        slideCount: _detail!.slideCount,
        designStyle: _detail!.designStyle,
        targetAudience: _detail!.targetAudience,
        language: _detail!.language,
        generatedPrompt: _detail!.generatedPrompt,
        createdAt: _detail!.createdAt,
        updatedAt: _detail!.updatedAt,
        isFavorite: !favNow,
        imageUrls: _detail!.imageUrls,
        imageOrientation: _detail!.imageOrientation,
        instagramCaption: _detail!.instagramCaption,
        tiktokCaption: _detail!.tiktokCaption,
        hashtags: _detail!.hashtags,
        slides: _detail!.slides,
      );
    });
  }

  Future<void> _delete() async {
    if (_detail == null) return;
    try {
      await ref.read(promptProvider.notifier).deleteHistory(_detail!.id);
      if (mounted) {
        ToastMessage.showSuccess(context, 'Riwayat dihapus');
        context.pop();
      }
    } catch (e) {
      if (mounted) {
        ToastMessage.showError(context, 'Gagal menghapus: $e');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (_detail == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Detail Prompa')),
        body: const Center(child: Text('Data tidak ditemukan.')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hasil Prompa'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.dashboard_customize_rounded),
            tooltip: 'Jadikan Template',
            onPressed: _showConvertToTemplateDialog,
          ),
          IconButton(
            icon: Icon(
              _detail!.isFavorite
                  ? Icons.favorite_rounded
                  : Icons.favorite_outline_rounded,
              color: _detail!.isFavorite ? theme.colorScheme.error : null,
            ),
            onPressed: _toggleFavorite,
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline_rounded),
            onPressed: _delete,
          ),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [Expanded(child: _buildMainView(theme))],
          ),
        ),
      ),
    );
  }

  Future<void> _uploadMultiImages() async {
    final picker = ImagePicker();
    final List<XFile> pickedFiles = await picker.pickMultiImage();
    if (pickedFiles.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(promptRepositoryProvider);
      final apiClient = ref.read(apiClientProvider);

      List<String> uploadedUrls = [];

      List<Map<String, dynamic>> filesData = [];
      for (int i = 0; i < pickedFiles.length; i++) {
        final bytes = await pickedFiles[i].readAsBytes();
        filesData.add({'bytes': bytes, 'fileName': pickedFiles[i].name});
      }

      final response = await apiClient.uploadFiles(
        '/api/upload-multi',
        filesData,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['urls'] != null) {
          uploadedUrls = List<String>.from(data['urls']);
        }
      } else {
        throw Exception('Gagal upload multi image');
      }

      // Update history with new images (replacing or appending)
      // The user probably wants to replace all images for this prompt
      await repo.updateHistory(_detail!.id, _detail!.title, uploadedUrls);
      await _fetchDetail();
      ToastMessage.showSuccess(
        context,
        '${uploadedUrls.length} Gambar berhasil diupload',
      );
    } catch (e) {
      ToastMessage.showError(context, e.toString());
      setState(() => _isLoading = false);
    }
  }

  void _showConvertToTemplateDialog() {
    final categories = ref.read(categoryProvider).categories;
    if (categories.isEmpty) {
      ToastMessage.showError(context, 'Kategori tidak tersedia');
      return;
    }

    String selectedCategoryId = categories.first.id;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setStateDialog) {
          return AlertDialog(
            title: const Text('Pilih Kategori Template'),
            content: DropdownButtonFormField<String>(
              value: selectedCategoryId,
              items: categories
                  .map(
                    (c) => DropdownMenuItem(value: c.id, child: Text(c.name)),
                  )
                  .toList(),
              onChanged: (val) {
                if (val != null) {
                  setStateDialog(() => selectedCategoryId = val);
                }
              },
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: 'Kategori',
              ),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Batal'),
              ),
              ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _convertToTemplate(selectedCategoryId);
                },
                child: const Text('Simpan'),
              ),
            ],
          );
        },
      ),
    );
  }

  Future<void> _convertToTemplate(String categoryId) async {
    setState(() => _isLoading = true);
    try {
      final apiClient = ref.read(apiClientProvider);

      final Map<String, dynamic> templateContentMap = {
        'slides': _detail!.hasStructuredSlides
            ? _detail!.slides.map((s) => s.toJson()).toList()
            : null,
        'rawText': !_detail!.hasStructuredSlides
            ? (_detail!.generatedPrompt ?? '')
            : null,
        'instagramCaption': _detail!.instagramCaption,
        'tiktokCaption': _detail!.tiktokCaption,
        'hashtags': _detail!.hashtags,
      };
      final String bundledContent = jsonEncode(templateContentMap);

      final response = await apiClient.post(
        '/api/templates',
        body: {
          'title': _detail!.title,
          'description': 'Dibuat dari riwayat: ${_detail!.designStyle}',
          'content': bundledContent,
          'thumbnailUrl': _detail!.imageUrls.isNotEmpty
              ? jsonEncode(_detail!.imageUrls)
              : null,
          'categoryId': categoryId,
          'isPremium': false,
        },
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        ToastMessage.showSuccess(context, 'Berhasil dijadikan Template');
        context.pop();
      } else {
        throw Exception(
          jsonDecode(response.body)['message'] ?? 'Gagal membuat template',
        );
      }
    } catch (e) {
      ToastMessage.showError(context, e.toString());
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Widget _buildSourceImageSection(ThemeData theme) {
    if (_detail!.sourceImageUrl == null || _detail!.sourceImageUrl!.isEmpty) {
      return const SizedBox.shrink();
    }

    final imageUrls = _detail!.sourceImageUrl!
        .split(',')
        .map((u) => u.trim())
        .where((u) => u.isNotEmpty)
        .toList();
    if (imageUrls.isEmpty) return const SizedBox.shrink();

    final isBanner = _detail!.contentType == 'Banner Promosi';
    final cardTitle = isBanner
        ? 'Gambar Referensi Banner'
        : 'Foto Produk Utama';
    final cardIcon = isBanner
        ? Icons.crop_original_rounded
        : Icons.shopping_bag_rounded;
    final cardThemeColor = isBanner ? const Color(0xFF0D9488) : Colors.orange;

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.outlineVariant.withOpacity(0.35),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: cardThemeColor.withOpacity(0.06),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Icon(cardIcon, color: cardThemeColor),
                const SizedBox(width: 10),
                Text(
                  cardTitle,
                  style: TextStyle(
                    color: cardThemeColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Info Section
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isBanner ? 'REFERENSI DESAIN' : 'PRODUK AFFILIATE',
                            style: TextStyle(
                              fontSize: 10,
                              color: cardThemeColor,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _detail!.title,
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Desain: ${_detail!.designStyle.split('|')[0].trim()}',
                            style: TextStyle(
                              fontSize: 11,
                              color: theme.colorScheme.onSurface.withOpacity(
                                0.5,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                // Horizontal list of images
                SizedBox(
                  height: 90,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: imageUrls.length,
                    itemBuilder: (context, index) {
                      final url = imageUrls[index];
                      final fullSourceUrl = _getFullImageUrl(url);
                      return Container(
                        margin: const EdgeInsets.only(right: 12),
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: theme.colorScheme.outlineVariant.withOpacity(
                              0.2,
                            ),
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: CachedNetworkImage(
                            imageUrl: fullSourceUrl,
                            fit: BoxFit.cover,
                            placeholder: (context, url) => Container(
                              color: theme.colorScheme.surfaceVariant,
                              child: const Center(
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                ),
                              ),
                            ),
                            errorWidget: (context, url, error) => Container(
                              color: theme.colorScheme.surfaceVariant,
                              child: const Icon(Icons.broken_image_rounded),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── Unified Main View ──────────────────────────────────────────────────
  Widget _buildMainView(ThemeData theme) {
    final hasCaption =
        _detail!.instagramCaption.isNotEmpty ||
        _detail!.tiktokCaption.isNotEmpty ||
        _detail!.hashtags.isNotEmpty;
    final hasSourceImage =
        _detail!.sourceImageUrl != null && _detail!.sourceImageUrl!.isNotEmpty;
    final isQuote = _detail!.contentType == 'Kata Mutiara';

    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 4),
      children: [
        const SizedBox(height: 8),
        _buildHeader(theme),
        if (isQuote) ...[
          _buildQuoteSummaryCard(theme),
          const SizedBox(height: 16),
        ],
        if (hasSourceImage) ...[
          _buildSourceImageSection(theme),
          const SizedBox(height: 16),
        ],
        _buildStructuredSlidesSection(theme),
        const SizedBox(height: 16),
        _buildMultiImageUploadSection(theme),
        const SizedBox(height: 16),
        if (hasCaption) _buildCaptionSection(theme),
        const SizedBox(height: 16),
        _buildFullPromptCard(theme),
        const SizedBox(height: 32),
      ],
    );
  }

  // ── Quote Summary Card ────────────────────────────────────────────────
  Widget _buildQuoteSummaryCard(ThemeData theme) {
    Map<String, dynamic>? parsedQuote;
    try {
      if (_detail!.generatedPrompt != null) {
        parsedQuote = jsonDecode(_detail!.generatedPrompt!) as Map<String, dynamic>?;
      }
    } catch (_) {}

    if (parsedQuote == null || parsedQuote['type'] != 'kata_mutiara') {
      return const SizedBox.shrink();
    }

    final String quote = parsedQuote['quote'] as String? ?? _detail!.title;
    final String? author = parsedQuote['author'] as String?;
    final String mood = parsedQuote['detected_mood'] as String? ?? '';
    final String moodColor = parsedQuote['mood_color_accent'] as String? ?? '#6366F1';
    final String imagePrompt = parsedQuote['image_prompt_english'] as String? ?? '';
    final String typographyInstruction = parsedQuote['typography_instruction'] as String? ?? '';
    final Map<String, dynamic>? palette = parsedQuote['color_palette'] as Map<String, dynamic>?;

    Color accentColor;
    try {
      final hex = moodColor.replaceAll('#', '');
      accentColor = Color(int.parse('FF$hex', radix: 16));
    } catch (_) {
      accentColor = theme.colorScheme.primary;
    }

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            accentColor.withValues(alpha: 0.12),
            accentColor.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: accentColor.withValues(alpha: 0.3), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: accentColor.withValues(alpha: 0.1),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header bar
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: accentColor.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Row(
              children: [
                Icon(Icons.format_quote_rounded, color: accentColor, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Kata Mutiara · $mood',
                  style: TextStyle(
                    color: accentColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Quote text
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: accentColor.withValues(alpha: 0.2)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SelectableText(
                        '"$quote"',
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontStyle: FontStyle.italic,
                          fontWeight: FontWeight.w600,
                          height: 1.5,
                          color: accentColor,
                        ),
                      ),
                      if (author != null && author.isNotEmpty) ...[
                        const SizedBox(height: 8),
                        Text(
                          '— $author',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Image Prompt (English)
                if (imagePrompt.isNotEmpty) ...[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '🖼️ Image Prompt (English)',
                        style: theme.textTheme.labelMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: accentColor,
                        ),
                      ),
                      InkWell(
                        onTap: () {
                          Clipboard.setData(ClipboardData(text: imagePrompt));
                          ToastMessage.showSuccess(context, 'Image prompt disalin!');
                        },
                        child: Row(
                          children: [
                            Icon(Icons.copy_rounded, size: 13, color: accentColor),
                            const SizedBox(width: 4),
                            Text('Salin', style: TextStyle(fontSize: 11, color: accentColor)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Container(
                    width: double.infinity,
                    constraints: const BoxConstraints(maxHeight: 150),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.8),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: SingleChildScrollView(
                      child: SelectableText(
                        imagePrompt,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 12,
                          color: Colors.lightGreenAccent,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
                // Typography instruction
                if (typographyInstruction.isNotEmpty) ...[
                  Text(
                    '🔤 Instruksi Tipografi',
                    style: theme.textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 6),
                  SelectableText(
                    typographyInstruction,
                    style: theme.textTheme.bodySmall?.copyWith(height: 1.5),
                  ),
                  const SizedBox(height: 12),
                ],
                // Color palette
                if (palette != null) ...[
                  Text(
                    '🎨 Palet Warna',
                    style: theme.textTheme.labelMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      if (palette['primary'] != null)
                        _buildColorChip('Latar: ${palette['primary']}', accentColor),
                      if (palette['accent'] != null)
                        _buildColorChip('Aksen: ${palette['accent']}', accentColor),
                      if (palette['text_color'] != null)
                        _buildColorChip('Teks: ${palette['text_color']}', accentColor),
                    ],
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildColorChip(String label, Color accentColor) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: accentColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(100),
        border: Border.all(color: accentColor.withValues(alpha: 0.25)),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 10,
          color: accentColor,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }


  Widget _buildFullPromptCard(ThemeData theme) {
    String formattedJson = _detail!.generatedPrompt ?? '';

    // Try to format it nicely if it's JSON
    try {
      if (formattedJson.trim().startsWith('{') ||
          formattedJson.trim().startsWith('[')) {
        final parsed = jsonDecode(formattedJson);
        formattedJson = const JsonEncoder.withIndent('  ').convert(parsed);

      }
    } catch (_) {}

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.outlineVariant.withOpacity(0.35),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.06),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.data_object_rounded,
                  color: theme.colorScheme.primary,
                ),
                const SizedBox(width: 10),
                Text(
                  'JSON Prompt Lengkap',
                  style: TextStyle(
                    color: theme.colorScheme.primary,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxHeight: 400),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.85),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.withOpacity(0.2)),
                  ),
                  child: SingleChildScrollView(
                    scrollDirection: Axis.vertical,
                    child: SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: SelectableText(
                        formattedJson,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 12,
                          color: Colors.greenAccent,
                          height: 1.4,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {
                      Clipboard.setData(ClipboardData(text: formattedJson));
                      ToastMessage.showSuccess(
                        context,
                        'Seluruh JSON disalin!',
                      );
                    },
                    icon: const Icon(Icons.copy_rounded, size: 16),
                    label: const Text('Salin Seluruh JSON'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primaryContainer,
                      foregroundColor: theme.colorScheme.onPrimaryContainer,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMultiImageUploadSection(ThemeData theme) {
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.outlineVariant.withOpacity(0.35),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Hasil Gambar',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                OutlinedButton.icon(
                  onPressed: _uploadMultiImages,
                  icon: const Icon(Icons.upload_file, size: 16),
                  label: const Text('Upload Multi Gambar'),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            if (_detail!.imageUrls.isNotEmpty)
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1,
                ),
                itemCount: _detail!.imageUrls.length,
                itemBuilder: (context, index) {
                  final imgUrl = _detail!.imageUrls[index];
                  if (imgUrl.isEmpty) return const SizedBox.shrink();
                  final fullUrl = _getFullImageUrl(imgUrl);
                  return _buildImagePreviewGrid(theme, fullUrl, index);
                },
              )
            else
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant.withOpacity(0.5),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Icon(
                      Icons.image_not_supported_outlined,
                      color: theme.colorScheme.onSurfaceVariant.withOpacity(
                        0.5,
                      ),
                      size: 40,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Belum ada gambar yang diupload',
                      style: TextStyle(
                        color: theme.colorScheme.onSurfaceVariant.withOpacity(
                          0.7,
                        ),
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

  Widget _buildImagePreviewGrid(
    ThemeData theme,
    String imgUrl,
    int slideIndex,
  ) {
    return GestureDetector(
      onTap: () {
        showDialog(
          context: context,
          builder: (_) => Dialog(
            backgroundColor: Colors.transparent,
            insetPadding: const EdgeInsets.all(16),
            child: Stack(
              alignment: Alignment.center,
              children: [
                InteractiveViewer(
                  minScale: 0.5,
                  maxScale: 5.0,
                  child: CachedNetworkImage(
                    imageUrl: imgUrl,
                    fit: BoxFit.contain,
                  ),
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(
                          Icons.download,
                          color: Colors.white,
                          size: 28,
                        ),
                        onPressed: () async {
                          try {
                            if (kIsWeb) {
                              openWebPage(imgUrl);
                              if (context.mounted)
                                ToastMessage.showSuccess(
                                  context,
                                  'Gambar dibuka di tab baru untuk disimpan.',
                                );
                              return;
                            }
                            var response = await Dio().get(
                              imgUrl,
                              options: Options(
                                responseType: ResponseType.bytes,
                              ),
                            );
                            await Gal.putImageBytes(
                              Uint8List.fromList(response.data),
                              name:
                                  'prompa_${DateTime.now().millisecondsSinceEpoch}',
                            );
                            if (context.mounted)
                              ToastMessage.showSuccess(
                                context,
                                'Tersimpan di Galeri',
                              );
                          } catch (e) {
                            if (context.mounted)
                              ToastMessage.showError(context, 'Gagal: $e');
                          }
                        },
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.close,
                          color: Colors.white,
                          size: 28,
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: CachedNetworkImage(
          imageUrl: imgUrl,
          fit: BoxFit.cover,
          placeholder: (_, __) =>
              const Center(child: CircularProgressIndicator()),
          errorWidget: (_, __, ___) => const Icon(Icons.error),
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _detail!.title,
          style: theme.textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 8,
          runSpacing: 6,
          children: [
            _buildTag(context, _detail!.contentType),
            _buildTag(context, '${_detail!.slideCount} Slide'),
            _buildTag(context, _detail!.imageOrientation),
            _buildTag(context, _detail!.targetAudience),
          ],
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildStructuredSlidesSection(ThemeData theme) {
    if (_detail!.slides.isEmpty) return const SizedBox.shrink();
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            'STRUKTUR SLIDE (${_detail!.slides.length})',
            style: theme.textTheme.labelLarge?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.primary.withValues(alpha: 0.7),
              letterSpacing: 1.2,
              fontSize: 12,
            ),
          ),
        ),
        ListView.separated(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _detail!.slides.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            final slide = _detail!.slides[index];
            final fullImageUrl = _detail!.imageUrls.length > index
                ? _getFullImageUrl(_detail!.imageUrls[index])
                : '';
            return _buildSlideCard(theme, slide, fullImageUrl);
          },
        ),
      ],
    );
  }

  Widget _buildSlideCard(ThemeData theme, dynamic slide, String fullImageUrl) {
    final PromptSlide s = slide as PromptSlide;
    final int slideNum = s.slideNumber;
    final int totalSlides = s.totalSlides;
    final String role = s.role;

    final String formattedJson = s.toCopyText();
    final accent = const Color(0xFF6366F1);

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: theme.colorScheme.outlineVariant.withValues(alpha: 0.2),
        ),
      ),
      child: Theme(
        data: theme.copyWith(dividerColor: Colors.transparent),
        child: ExpansionTile(
          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
          collapsedShape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
          backgroundColor: Colors.transparent,
          collapsedBackgroundColor: Colors.transparent,
          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          leading: Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: accent,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              'SLIDE $slideNum',
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 10,
                letterSpacing: 0.5,
              ),
            ),
          ),
          title: Text(
            role,
            style: theme.textTheme.titleSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(height: 1, indent: 0, endIndent: 0),
                  const SizedBox(height: 16),
                  // Content Preview (Simplified)
                  if (s.instruksiAwalWajib.isNotEmpty) ...[
                    _buildSlideTextItem('Instruksi Awal Wajib', s.instruksiAwalWajib, theme),
                    const SizedBox(height: 8),
                  ],
                  if (s.gayaDominan.isNotEmpty) ...[
                    _buildSlideTextItem('Gaya Dominan', s.gayaDominan, theme),
                    const SizedBox(height: 8),
                  ],
                  if (s.headline.isNotEmpty) ...[
                    _buildSlideTextItem('Headline', s.headline, theme),
                    const SizedBox(height: 8),
                  ],
                  if (s.detail.isNotEmpty) ...[
                    _buildSlideTextItem('Detail', s.detail, theme),
                    const SizedBox(height: 8),
                  ],
                  if (s.mediaSosialAturan.isNotEmpty) ...[
                    _buildSlideTextItem('Aturan Media Sosial & Watermark', s.mediaSosialAturan, theme),
                    const SizedBox(height: 8),
                  ],
                  
                  const SizedBox(height: 12),
                  // Action Buttons Row
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            Clipboard.setData(ClipboardData(text: formattedJson));
                            ToastMessage.showSuccess(context, 'JSON Slide $slideNum disalin!');
                          },
                          icon: const Icon(Icons.copy_rounded, size: 14),
                          label: const Text('Salin JSON'),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: FilledButton.icon(
                          onPressed: () => _uploadImageForSlide(slideNum - 1),
                          icon: const Icon(Icons.upload_file_rounded, size: 14),
                          label: Text(fullImageUrl.isNotEmpty ? 'Ganti Foto' : 'Upload Foto'),
                          style: FilledButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            backgroundColor: accent,
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  if (fullImageUrl.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    _buildImagePreview(theme, fullImageUrl, slideNum - 1),
                  ],
                  
                  const SizedBox(height: 12),
                  // Raw JSON Toggle (Optional small button)
                  TextButton.icon(
                    onPressed: () => _showRawJsonDialog(context, slideNum, formattedJson),
                    icon: const Icon(Icons.code_rounded, size: 14),
                    label: const Text('Lihat JSON Mentah', style: TextStyle(fontSize: 12)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSlideTextItem(String label, String value, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label.toUpperCase(),
          style: TextStyle(
            fontSize: 9,
            fontWeight: FontWeight.bold,
            color: theme.colorScheme.onSurface.withValues(alpha: 0.4),
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: theme.textTheme.bodySmall?.copyWith(
            color: theme.colorScheme.onSurface.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }

  void _showRawJsonDialog(BuildContext context, int slideNum, String json) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('JSON Slide $slideNum'),
        content: Container(
          width: double.maxFinite,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(12),
          ),
          child: SingleChildScrollView(
            child: SelectableText(
              json,
              style: const TextStyle(color: Colors.greenAccent, fontFamily: 'monospace', fontSize: 11),
            ),
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Tutup')),
          FilledButton(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: json));
              Navigator.pop(ctx);
              ToastMessage.showSuccess(context, 'Disalin!');
            },
            child: const Text('Salin'),
          ),
        ],
      ),
    );
  }

  Widget _buildStructuredView(ThemeData theme) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _detail!.slides.length + 1,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        if (index == 0) return _buildHeader(theme);
        final slide = _detail!.slides[index - 1];
        final fullImageUrl = _detail!.imageUrls.length > (index - 1)
            ? _getFullImageUrl(_detail!.imageUrls[index - 1])
            : '';
        return _buildSlideCard(theme, slide, fullImageUrl);
      },
    );
  }

  Future<void> _uploadImageForSlide(int index) async {
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

      List<String> currentImages = List<String>.from(_detail!.imageUrls);
      while (currentImages.length <= index) {
        currentImages.add('');
      }
      currentImages[index] = imageUrl;

      await repo.updateHistory(_detail!.id, _detail!.title, currentImages);
      await _fetchDetail();
      ToastMessage.showSuccess(context, 'Gambar slide ${index + 1} berhasil diupload');
    } catch (e) {
      ToastMessage.showError(context, e.toString());
      setState(() => _isLoading = false);
    }
  }

  Widget _buildImagePreview(ThemeData theme, String imgUrl, int slideIndex) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GestureDetector(
        onTap: () {
          showDialog(
            context: context,
            builder: (_) => Dialog(
              backgroundColor: Colors.transparent,
              insetPadding: const EdgeInsets.all(16),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  InteractiveViewer(
                    minScale: 0.5,
                    maxScale: 5.0,
                    child: CachedNetworkImage(
                      imageUrl: imgUrl,
                      fit: BoxFit.contain,
                    ),
                  ),
                  Positioned(
                    top: 10,
                    right: 10,
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(
                            Icons.download,
                            color: Colors.white,
                            size: 28,
                          ),
                          onPressed: () async {
                            try {
                              if (kIsWeb) {
                                openWebPage(imgUrl);
                                if (context.mounted)
                                  ToastMessage.showSuccess(
                                    context,
                                    'Gambar dibuka di tab baru untuk disimpan.',
                                  );
                                return;
                              }
                              var response = await Dio().get(
                                imgUrl,
                                options: Options(
                                  responseType: ResponseType.bytes,
                                ),
                              );
                              await Gal.putImageBytes(
                                Uint8List.fromList(response.data),
                                name:
                                    'prompa_${DateTime.now().millisecondsSinceEpoch}',
                              );
                              if (context.mounted)
                                ToastMessage.showSuccess(
                                  context,
                                  'Tersimpan di Galeri',
                                );
                            } catch (e) {
                              if (context.mounted)
                                ToastMessage.showError(context, 'Gagal: $e');
                            }
                          },
                        ),
                        IconButton(
                          icon: const Icon(
                            Icons.close,
                            color: Colors.white,
                            size: 28,
                          ),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: CachedNetworkImage(
            imageUrl: imgUrl,
            height: 180,
            width: double.infinity,
            fit: BoxFit.cover,
            placeholder: (_, __) =>
                const Center(child: CircularProgressIndicator()),
            errorWidget: (_, __, ___) => const Icon(Icons.error),
          ),
        ),
      ),
    );
  }

  Widget _buildCaptionSection(ThemeData theme) {
    const igColor = Color(0xFFE1306C);
    const ttColor = Color(0xFF69C9D0);
    const hashColor = Color(0xFF6366F1);

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [igColor.withOpacity(0.06), ttColor.withOpacity(0.04)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: igColor.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 4),
            child: Row(
              children: [
                const Icon(
                  Icons.auto_awesome_rounded,
                  color: igColor,
                  size: 18,
                ),
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
          if (_detail!.instagramCaption.isNotEmpty)
            _buildCaptionTile(
              theme,
              '📸 Instagram Caption',
              _detail!.instagramCaption,
              igColor,
            ),
          if (_detail!.tiktokCaption.isNotEmpty)
            _buildCaptionTile(
              theme,
              '🎵 TikTok Caption',
              _detail!.tiktokCaption,
              ttColor,
            ),
          if (_detail!.hashtags.isNotEmpty)
            _buildCaptionTile(
              theme,
              '# Hashtags',
              _detail!.hashtags,
              hashColor,
            ),
        ],
      ),
    );
  }

  Widget _buildCaptionTile(
    ThemeData theme,
    String label,
    String value,
    Color color,
  ) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
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
          SelectableText(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(height: 1.55),
          ),
          const SizedBox(height: 8),
          Divider(color: color.withOpacity(0.1), height: 1),
        ],
      ),
    );
  }

  Widget _buildTag(BuildContext context, String text) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: theme.colorScheme.primary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: theme.colorScheme.primary,
        ),
      ),
    );
  }
}
