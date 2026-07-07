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
import 'package:cached_network_image/cached_network_image.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/core/constants/colors.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/custom_button.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/widgets/toast_message.dart';
import 'package:promting_app/data/models/character.dart';

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

const _orientationOptions = [
  'Instagram Potret (3:4) - Canvas: 1080 × 1440 px',
  'Persegi (Square 1:1)',
  'Potret (Portrait 4:5)',
  'Lanskap (Landscape 16:9)',
];

const _contentTypesIklan = [
  'Banner Ads / Iklan Produk',
  'Promo Diskon / Flash Sale',
  'Product Showcase',
  'Story Promo Produk',
  'Review Affiliate',
  'Iklan Sponsor Sosmed',
];

class _BgOption {
  final String label;
  final String value;
  const _BgOption({required this.label, required this.value});
}

class AdPromptGeneratorScreen extends ConsumerStatefulWidget {
  const AdPromptGeneratorScreen({super.key});

  @override
  ConsumerState<AdPromptGeneratorScreen> createState() => _AdPromptGeneratorScreenState();
}

class _AdPromptGeneratorScreenState extends ConsumerState<AdPromptGeneratorScreen> {
  final _formKey = GlobalKey<FormState>();
  final _descController = TextEditingController();
  
  // Optional parameters
  final _brandController = TextEditingController();
  final _priceController = TextEditingController();
  final _sellingPointsController = TextEditingController();
  final _ctaController = TextEditingController();

  String _selectedContentType = _contentTypesIklan.first;
  String? _selectedDesignStyleId;
  String? _selectedDesignStyleName;
  String? _selectedAudienceId;
  String? _selectedAudienceName;
  String _selectedBackground = _backgroundOptions.first.value;
  String _selectedOrientation = _orientationOptions.first;
  int _slideCount = 5;
  bool _includeCaption = true;
  bool _showAdvancedOptions = false;
  bool _isUploadingImage = false;

  final List<XFile> _productImages = [];
  final List<String> _uploadedImageUrls = [];

  List<TargetAudience> _audiences = [];
  List<DesignStyle> _designStyles = [];
  List<Character> _characters = [];
  String? _selectedCharacterId;
  bool _useCharacter = false;
  bool _isLoadingOptions = true;

  @override
  void initState() {
    super.initState();
    _loadOptions();
  }

  Future<void> _loadOptions() async {
    setState(() => _isLoadingOptions = true);
    final repo = ref.read(appOptionsRepositoryProvider);
    final audiences = await repo.getTargetAudiences();
    // Coba load themes dengan kategori IKLAN
    var styles = await repo.getThemes('IKLAN');
    if (styles.isEmpty) {
      styles = await repo.getDesignStyles();
    }
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
    _descController.dispose();
    _brandController.dispose();
    _priceController.dispose();
    _sellingPointsController.dispose();
    _ctaController.dispose();
    super.dispose();
  }

  Future<void> _pickProductImage() async {
    if (_productImages.length >= 3) {
      ToastMessage.showWarning(context, 'Maksimal 3 foto produk.');
      return;
    }
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (pickedFile != null) {
      setState(() {
        _productImages.add(pickedFile);
      });
    }
  }

  void _removeProductImage(int index) {
    setState(() {
      _productImages.removeAt(index);
    });
  }

  Future<void> _generate() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedAudienceName == null || _selectedDesignStyleName == null) {
      ToastMessage.showError(context, 'Pilih Target Audiens dan Gaya Desain terlebih dahulu.');
      return;
    }

    setState(() => _isUploadingImage = true);
    _uploadedImageUrls.clear();

    try {
      // 1. Upload product images if selected
      final repo = ref.read(promptRepositoryProvider);
      for (final file in _productImages) {
        final bytes = await file.readAsBytes();
        final imageUrl = await repo.uploadImage(
          file.path,
          bytes: bytes,
          fileName: file.name,
        );
        _uploadedImageUrls.add(imageUrl);
      }
    } catch (e) {
      ToastMessage.showError(context, 'Gagal mengunggah foto produk: $e');
      setState(() => _isUploadingImage = false);
      return;
    }

    setState(() => _isUploadingImage = false);

    final bgLabel = _backgroundOptions.firstWhere(
      (b) => b.value == _selectedBackground,
      orElse: () => _backgroundOptions.first,
    ).label;

    final productTitle = _brandController.text.isNotEmpty 
        ? '${_brandController.text} - ${_descController.text.split(" ").take(3).join(" ")}'
        : _descController.text.split(" ").take(5).join(" ");

    await ref.read(promptProvider.notifier).generateAdPrompt(
      title: productTitle,
      contentType: _selectedContentType,
      slideCount: _slideCount,
      designStyle: '$_selectedDesignStyleName | Orientasi: $_selectedOrientation',
      targetAudience: _selectedAudienceName!,
      imageOrientation: _selectedOrientation,
      sourceImageUrl: _uploadedImageUrls.isNotEmpty ? _uploadedImageUrls.join(',') : null,
      description: _descController.text.trim(),
      brand: _brandController.text.trim().isEmpty ? null : _brandController.text.trim(),
      price: _priceController.text.trim().isEmpty ? null : _priceController.text.trim(),
      sellingPoints: _sellingPointsController.text.trim().isEmpty ? null : _sellingPointsController.text.trim(),
      cta: _ctaController.text.trim().isEmpty ? null : _ctaController.text.trim(),
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
    final isDark = theme.brightness == Brightness.dark;
    final isGenerating = promptState.isGenerating || _isUploadingImage;

    return Stack(
      children: [
        Scaffold(
          appBar: AppBar(
            title: const Text('Generator Prompa Iklan'),
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
                  'Buat Prompt Iklan',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),

                _buildSectionTitle(theme, 'Detail Produk'),
                _buildProductImageSection(theme, isDark),
                const SizedBox(height: 24),

                CustomTextField(
                  controller: _descController,
                  labelText: 'Deskripsi Produk',
                  hintText: 'misal: Skincare pencerah wajah dengan vitamin C...',
                  prefixIcon: Icons.description_rounded,
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) return 'Deskripsi wajib diisi';
                    if (value.trim().length < 10) return 'Jelaskan produk minimal 10 karakter';
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
                          labelText: 'Jenis Iklan',
                          prefixIcon: Icon(Icons.campaign_rounded),
                        ),
                        items: _contentTypesIklan.map((type) {
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
                      isLoading: isGenerating,
                      onPressed: _generate,
                      isSecondary: false,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
        ),
        if (isGenerating) _buildLoadingOverlay(isDark, theme),
      ],
    );
  }

  Widget _buildProductImageSection(ThemeData theme, bool isDark) {
    return _buildImagePickerContainer(theme);
  }

  Widget _buildImagePickerContainer(ThemeData theme) {
    final accentColor = const Color(0xFFFF6B35);

    return SizedBox(
      height: 90,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _productImages.length + 1,
        itemBuilder: (context, index) {
          if (index == _productImages.length) {
            return GestureDetector(
              onTap: _pickProductImage,
              child: Container(
                width: 90,
                height: 90,
                decoration: BoxDecoration(
                  color: theme.colorScheme.onSurface.withOpacity(0.03),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: theme.colorScheme.outline.withOpacity(0.2),
                    style: BorderStyle.solid,
                  ),
                ),
                child: Icon(Icons.add_photo_alternate_rounded, size: 28, color: accentColor),
              ),
            );
          }

          final file = _productImages[index];
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
                  onTap: () => _removeProductImage(index),
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

  Widget _buildAdvancedOptionsAccordion(ThemeData theme) {
    final accentColor = const Color(0xFFFF6B35);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _showAdvancedOptions 
              ? accentColor.withOpacity(0.3) 
              : theme.colorScheme.outline.withOpacity(0.15),
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _showAdvancedOptions = !_showAdvancedOptions),
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
              child: Row(
                children: [
                  Icon(Icons.assignment_turned_in_rounded, color: accentColor),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Informasi Tambahan (Opsional)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        Text(
                          'Tentukan merek, harga, dan keunggulan untuk hasil lebih presisi',
                          style: TextStyle(fontSize: 11, color: theme.colorScheme.onSurface.withOpacity(0.5)),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    _showAdvancedOptions ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded,
                    color: accentColor,
                  ),
                ],
              ),
            ),
          ),
          if (_showAdvancedOptions)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
              child: Column(
                children: [
                  const Divider(),
                  const SizedBox(height: 12),
                  CustomTextField(
                    controller: _brandController,
                    labelText: 'Merek Produk',
                    hintText: 'misal: Somethinc, Wardah, SK-II',
                    prefixIcon: Icons.branding_watermark_rounded,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _priceController,
                    labelText: 'Harga Promo / Spesial',
                    hintText: 'misal: Rp 89.000 atau Cuma 99k',
                    prefixIcon: Icons.local_offer_rounded,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _sellingPointsController,
                    labelText: 'Keunggulan Utama (Unique Selling Points)',
                    hintText: 'misal: Mencerahkan 10x lipat, aman bumil, glowing seketika',
                    prefixIcon: Icons.star_rounded,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _ctaController,
                    labelText: 'Call to Action (CTA) Kustom',
                    hintText: 'misal: Klik link di bio no. 7 atau DM untuk promo',
                    prefixIcon: Icons.ads_click_rounded,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildCaptionToggle(ThemeData theme) {
    final accentColor = const Color(0xFFFF6B35);
    return Container(
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _includeCaption
              ? accentColor.withOpacity(0.4)
              : theme.colorScheme.outline.withOpacity(0.2),
        ),
        boxShadow: _includeCaption
            ? [BoxShadow(color: accentColor.withOpacity(0.08), blurRadius: 12)]
            : [],
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: () => setState(() => _includeCaption = !_includeCaption),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _includeCaption
                      ? accentColor.withOpacity(0.12)
                      : theme.colorScheme.outline.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  Icons.auto_awesome_rounded,
                  size: 18,
                  color: _includeCaption
                      ? accentColor
                      : theme.colorScheme.onSurface.withOpacity(0.4),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Generate Salinan Media Sosial',
                      style: theme.textTheme.labelLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: _includeCaption
                            ? accentColor
                            : theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                    Text(
                      _includeCaption
                          ? 'Caption Instagram, TikTok & hashtag promosi affiliate akan di-generate'
                          : 'Caption jualan tidak akan di-generate',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                  ],
                ),
              ),
              Switch(
                value: _includeCaption,
                onChanged: (val) => setState(() => _includeCaption = val),
                activeColor: accentColor,
              ),
            ],
          ),
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
                      Icons.auto_awesome_rounded,
                      color: theme.colorScheme.primary,
                      size: 24,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Text(
                  'Mengolah Prompa Iklan',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                    letterSpacing: -0.3,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                _buildLoadingSteps(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingSteps(ThemeData theme) {
    final textStyle = TextStyle(fontSize: 13, color: theme.colorScheme.onSurface.withOpacity(0.7));
    
    // Simulate real steps based on state
    String activeText = 'Sedang menganalisis detail gambar produk...';
    if (_uploadedImageUrls.isNotEmpty && _uploadedImageUrls.length == _productImages.length) {
      activeText = 'Sistem Llama-4 sedang melakukan riset virtual & merumuskan 10 materi iklan...';
    }

    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.search_rounded, size: 16, color: Color(0xFFFF6B35)),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                activeText,
                style: textStyle,
                textAlign: TextAlign.center,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Text(
          'Proses ini memerlukan waktu 10-15 detik karena LLM menganalisis visual secara otonom.',
          style: TextStyle(fontSize: 11, color: theme.colorScheme.onSurface.withOpacity(0.4)),
          textAlign: TextAlign.center,
        )
      ],
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
                  character.imageUrl!.startsWith('http')
                      ? character.imageUrl!
                      : '${EnvConfig.baseUrl}/${character.imageUrl}',
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
