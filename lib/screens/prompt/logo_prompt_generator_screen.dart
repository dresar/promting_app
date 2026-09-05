import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' show ImageFilter;
import 'package:promting_app/core/utils/web_helper.dart';
import 'package:dio/dio.dart';
import 'package:gal/gal.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/core/constants/colors.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/custom_button.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/widgets/toast_message.dart';

const _shapeOptions = [
  'Lingkaran (Circle)',
  'Persegi (Square)',
  'Segitiga (Triangle)',
  'Perisai (Shield)',
  'Abstrak (Abstract)',
  'Monogram / Lettermark',
  'Maskot (Mascot)',
  'Emblem / Crest',
  'Bebas / Kustom',
];

const _layoutOptions = [
  'Persegi (1:1) - 1024 × 1024 px',
  'Portrait (3:4) - 768 × 1024 px',
  'Lanskap (16:9) - 1024 × 576 px',
];

class LogoPromptGeneratorScreen extends ConsumerStatefulWidget {
  const LogoPromptGeneratorScreen({super.key});

  @override
  ConsumerState<LogoPromptGeneratorScreen> createState() => _LogoPromptGeneratorScreenState();
}

class _LogoPromptGeneratorScreenState extends ConsumerState<LogoPromptGeneratorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();

  String _selectedShape = _shapeOptions.first;
  String _selectedLayout = _layoutOptions.first;
  String? _selectedDesignStyleId;
  String? _selectedDesignStyleName;
  bool _isUploadingImage = false;
  int _slideCount = 10;

  final List<XFile> _referenceImages = [];
  final List<String> _uploadedImageUrls = [];

  List<DesignStyle> _designStyles = [];
  bool _isLoadingOptions = true;

  @override
  void initState() {
    super.initState();
    _loadOptions();
  }

  Future<void> _loadOptions() async {
    setState(() => _isLoadingOptions = true);
    final repo = ref.read(appOptionsRepositoryProvider);
    // Coba load themes dengan kategori LOGO
    var styles = await repo.getThemes('LOGO');
    if (styles.isEmpty) {
      // Fallback ke design_styles biasa jika themes kosong
      styles = await repo.getDesignStyles();
    }
    if (mounted) {
      setState(() {
        _designStyles = styles;
        if (styles.isNotEmpty) {
          _selectedDesignStyleId = styles.first.id;
          _selectedDesignStyleName = styles.first.name;
        }
        _isLoadingOptions = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    if (_referenceImages.length >= 3) {
      ToastMessage.showWarning(context, 'Maksimal 3 foto referensi logo.');
      return;
    }
    final picker = ImagePicker();
    final file = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (file != null) {
      setState(() {
        _referenceImages.add(file);
      });
    }
  }

  void _removeImage(int index) {
    setState(() {
      _referenceImages.removeAt(index);
    });
  }

  Future<void> _generate() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedDesignStyleName == null) {
      ToastMessage.showError(context, 'Pilih Gaya Desain terlebih dahulu.');
      return;
    }

    setState(() => _isUploadingImage = true);
    _uploadedImageUrls.clear();

    try {
      // Upload layout reference images (up to 3 files)
      final repo = ref.read(promptRepositoryProvider);
      for (final file in _referenceImages) {
        final bytes = await file.readAsBytes();
        final url = await repo.uploadImage(
          file.path,
          bytes: bytes,
          fileName: file.name,
        );
        _uploadedImageUrls.add(url);
      }
    } catch (e) {
      if (mounted) {
        ToastMessage.showError(context, 'Gagal mengunggah foto referensi logo: $e');
      }
      setState(() => _isUploadingImage = false);
      return;
    }

    setState(() => _isUploadingImage = false);

    await ref.read(promptProvider.notifier).generateLogoPrompt(
      title: _titleController.text.trim(),
      contentType: 'Pembuatan Logo',
      designStyle: _selectedDesignStyleName!,
      description: _descController.text.trim(),
      layoutSize: _selectedLayout,
      shape: _selectedShape,
      slideCount: _slideCount,
      sourceImageUrl: _uploadedImageUrls.isNotEmpty ? _uploadedImageUrls.join(',') : null,
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
    final accentColor = const Color(0xFFD946EF); // Fuchsia logo accent color

    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(
            title: const Text('Logo Creator', style: TextStyle(fontWeight: FontWeight.bold)),
            elevation: 0,
            backgroundColor: Colors.transparent,
            foregroundColor: isDark ? Colors.white : Colors.black87,
          ),
          body: _isLoadingOptions
              ? const Center(child: CircularProgressIndicator())
              : SafeArea(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20.0),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                Text(
                  'Buat Prompt Logo',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),

                          // Textfields
                          CustomTextField(
                            controller: _titleController,
                            labelText: 'Nama Brand / Teks Logo',
                            hintText: 'Contoh: Kopi Kenangan, TechCorp',
                            validator: (val) => val == null || val.trim().isEmpty ? 'Nama Brand wajib diisi' : null,
                          ),
                          const SizedBox(height: 16),

                          CustomTextField(
                            controller: _descController,
                            labelText: 'Deskripsi & Filosofi Brand',
                            hintText: 'Tulis bidang usaha, filosofi, nilai utama, dan nuansa logo yang ingin disampaikan (Contoh: kedai kopi arabika premium yang mengutamakan keramahan, hangat, dan ramah lingkungan).',
                            maxLines: 4,
                            validator: (val) => val == null || val.trim().isEmpty ? 'Filosofi brand wajib diisi' : null,
                          ),
                          const SizedBox(height: 20),

                          // Image picker
                          Text(
                            'Logo Referensi Visual / Desain Yang Disukai (Maks 3)',
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          _buildImagePickerList(theme),
                          const SizedBox(height: 20),

                          // Jumlah Slide/Halaman
                          Text(
                            'Jumlah Halaman Guidelines',
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurface : Colors.grey[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<int>(
                                value: _slideCount,
                                isExpanded: true,
                                dropdownColor: isDark ? AppColors.darkSurface : Colors.white,
                                items: [1, 3, 5, 10].map((int value) {
                                  String label = '$value Halaman';
                                  if (value == 1) {
                                    label += ' (Hanya Logo Utama)';
                                  } else if (value == 10) {
                                    label += ' (Brand Book Lengkap)';
                                  }
                                  return DropdownMenuItem<int>(
                                    value: value,
                                    child: Text(label),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _slideCount = val);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _slideCount == 10
                                ? 'Membuat 10 slide: Logo, filosofi bentuk & warna, tipografi, logo transparan, kaos/baju, tumbler, spanduk/banner, kartu nama, & do\'s/don\'ts.'
                                : _slideCount == 5
                                    ? 'Membuat 5 slide: Logo utama, filosofi bentuk/warna, logo transparan, mockup produk, & aturan branding.'
                                    : _slideCount == 3
                                        ? 'Membuat 3 slide: Logo utama, makna/warna, & mockup merchandise.'
                                        : 'Hanya membuat 1 slide berisi konsep & prompt logo utama.',
                            style: theme.textTheme.bodySmall?.copyWith(color: Colors.grey, fontSize: 11),
                          ),
                          const SizedBox(height: 16),

                          // Dropdowns
                          Text(
                            'Bentuk Logo Utama',
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurface : Colors.grey[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedShape,
                                isExpanded: true,
                                dropdownColor: isDark ? AppColors.darkSurface : Colors.white,
                                items: _shapeOptions.map((String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Text(value),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedShape = val);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          Text(
                            'Ukuran Logo / Canvas',
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurface : Colors.grey[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedLayout,
                                isExpanded: true,
                                dropdownColor: isDark ? AppColors.darkSurface : Colors.white,
                                items: _layoutOptions.map((String value) {
                                  return DropdownMenuItem<String>(
                                    value: value,
                                    child: Text(value, overflow: TextOverflow.ellipsis),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) setState(() => _selectedLayout = val);
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Style selector
                          Text(
                            'Tema Presentasi Logo',
                            style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                            decoration: BoxDecoration(
                              color: isDark ? AppColors.darkSurface : Colors.grey[100],
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedDesignStyleId,
                                isExpanded: true,
                                dropdownColor: isDark ? AppColors.darkSurface : Colors.white,
                                items: _designStyles.map((style) {
                                  return DropdownMenuItem<String>(
                                    value: style.id,
                                    child: Row(
                                      children: [
                                        ClipRRect(
                                          borderRadius: BorderRadius.circular(4),
                                          child: SizedBox(
                                            width: 24,
                                            height: 24,
                                            child: _buildStyleImagePreviewMini(style),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(child: Text(style.name, overflow: TextOverflow.ellipsis)),
                                      ],
                                    ),
                                  );
                                }).toList(),
                                onChanged: (val) {
                                  if (val != null) {
                                    final found = _designStyles.firstWhere((s) => s.id == val);
                                    setState(() {
                                      _selectedDesignStyleId = val;
                                      _selectedDesignStyleName = found.name;
                                    });
                                  }
                                },
                              ),
                            ),
                          ),
                          if (_selectedDesignStyleId != null) ...[
                            const SizedBox(height: 12),
                            _buildSelectedStylePreviewCard(theme),
                          ],
                          const SizedBox(height: 32),

                          CustomButton(
                            text: 'Generate',
                            onPressed: _generate,
                            isLoading: promptState.isGenerating,
                          ),
                          const SizedBox(height: 40),
                        ],
                      ),
                    ),
                  ),
                ),
        ),
        if (promptState.isGenerating || _isUploadingImage)
          Positioned.fill(
            child: _buildLoadingOverlay(isDark, theme),
          ),
      ],
    );
  }

  Widget _buildImagePickerList(ThemeData theme) {
    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _referenceImages.length + 1,
        itemBuilder: (context, index) {
          if (index == _referenceImages.length) {
            return GestureDetector(
              onTap: _pickImage,
              child: Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: theme.colorScheme.onSurface.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: theme.colorScheme.outline.withOpacity(0.2), style: BorderStyle.solid),
                ),
                child: const Icon(Icons.add_photo_alternate_rounded, size: 28, color: Colors.grey),
              ),
            );
          }

          final file = _referenceImages[index];
          return Stack(
            children: [
              Container(
                margin: const EdgeInsets.only(right: 12),
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  image: DecorationImage(
                    image: kIsWeb ? NetworkImage(file.path) : FileImage(File(file.path)) as ImageProvider,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Positioned(
                top: 4,
                right: 16,
                child: GestureDetector(
                  onTap: () => _removeImage(index),
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(color: Colors.black54, shape: BoxShape.circle),
                    child: const Icon(Icons.close, color: Colors.white, size: 14),
                  ),
                ),
              ),
            ],
          );
        },
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

  Widget _buildPlaceholderIconMini() {
    return Container(
      width: 24,
      height: 24,
      color: Colors.grey.shade800,
      child: const Icon(Icons.brush, size: 12, color: Colors.white70),
    );
  }

  Widget _buildPlaceholderIconLarge() {
    return Container(
      width: 80,
      height: 80,
      color: Colors.grey.shade800,
      child: const Icon(Icons.image, size: 24, color: Colors.white70),
    );
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

  Widget _buildSelectedStylePreviewCard(ThemeData theme) {
    if (_selectedDesignStyleId == null) return const SizedBox.shrink();
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
                    const SizedBox(width: 8),
                    Material(
                      color: Colors.black.withOpacity(0.5),
                      shape: const CircleBorder(),
                      child: IconButton(
                        icon: const Icon(Icons.close, color: Colors.white, size: 28),
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

  Widget _buildLoadingOverlay(bool isDark, ThemeData theme) {
    return Material(
      color: Colors.black54,
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
        child: Center(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 40),
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            decoration: BoxDecoration(
              color: isDark ? AppColors.darkSurface : Colors.white,
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: theme.colorScheme.outline.withOpacity(0.15)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.25),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                )
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 56,
                      height: 56,
                      child: CircularProgressIndicator(
                        strokeWidth: 3.5,
                        valueColor: AlwaysStoppedAnimation<Color>(theme.colorScheme.primary),
                        backgroundColor: theme.colorScheme.primary.withOpacity(0.1),
                      ),
                    ),
                    Icon(
                      Icons.brush_rounded,
                      color: theme.colorScheme.primary,
                      size: 24,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Mengunggah Gambar & Menghasilkan Prompt...',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Proses ini memerlukan waktu sekitar 10-15 detik',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.5),
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
