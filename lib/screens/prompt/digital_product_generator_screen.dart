import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' show ImageFilter;
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import 'package:promting_app/core/config/env_config.dart';
import 'package:promting_app/data/repositories/app_options_repository.dart';
import 'package:promting_app/providers/base_providers.dart';
import 'package:promting_app/providers/prompt_provider.dart';
import 'package:promting_app/widgets/custom_textfield.dart';
import 'package:promting_app/widgets/toast_message.dart';
import 'package:promting_app/data/models/character.dart';

const _primaryStart = Color(0xFF7C3AED); // Violet
const _primaryEnd = Color(0xFFDB2777);   // Pink-Magenta

class ColorOption {
  final String label;
  final String englishValue;
  final Color hexColor;

  const ColorOption({
    required this.label,
    required this.englishValue,
    required this.hexColor,
  });
}

const List<ColorOption> _colorOptions = [
  ColorOption(label: 'Hitam', englishValue: 'black', hexColor: Colors.black),
  ColorOption(label: 'Putih', englishValue: 'white', hexColor: Colors.white),
  ColorOption(label: 'Emas', englishValue: 'gold', hexColor: Color(0xFFD4AF37)),
  ColorOption(label: 'Kuning', englishValue: 'yellow', hexColor: Color(0xFFFFD600)),
  ColorOption(label: 'Abu-abu', englishValue: 'gray', hexColor: Color(0xFF757575)),
  ColorOption(label: 'Biru', englishValue: 'blue', hexColor: Color(0xFF1E88E5)),
  ColorOption(label: 'Merah', englishValue: 'red', hexColor: Color(0xFFE53935)),
  ColorOption(label: 'Ungu', englishValue: 'purple', hexColor: Color(0xFF8E24AA)),
  ColorOption(label: 'Hijau', englishValue: 'green', hexColor: Color(0xFF43A047)),
  ColorOption(label: 'Oranye', englishValue: 'orange', hexColor: Color(0xFFFB8C00)),
  ColorOption(label: 'Pink', englishValue: 'pink', hexColor: Color(0xFFD81B60)),
];

class DigitalProductGeneratorScreen extends ConsumerStatefulWidget {
  const DigitalProductGeneratorScreen({super.key});

  @override
  ConsumerState<DigitalProductGeneratorScreen> createState() =>
      _DigitalProductGeneratorScreenState();
}

class _DigitalProductGeneratorScreenState
    extends ConsumerState<DigitalProductGeneratorScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _descController = TextEditingController();
  final _brandController = TextEditingController();
  final _priceController = TextEditingController();
  final _additionalPromptController = TextEditingController();

  String? _selectedProductType;
  String? _selectedDesignStyleId;
  String? _selectedDesignStyleName;
  String? _selectedAudienceId;
  String? _selectedAudienceName;
  int _slideCount = 3;
  bool _includeCaption = true;
  bool _isUploadingImage = false;
  bool _showAdvancedOptions = false;
  String _selectedColor1 = 'Hitam';
  String _selectedColor2 = 'Emas';

  final List<XFile> _productImages = [];
  final List<String> _uploadedImageUrls = [];

  List<TargetAudience> _audiences = [];
  List<DesignStyle> _designStyles = [];
  List<Character> _characters = [];
  List<DigitalProductType> _productTypes = [];
  String? _selectedCharacterId;
  bool _useCharacter = false;
  bool _isLoadingOptions = true;

  late AnimationController _animController;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeInOut);
    _animController.forward();
    _loadOptions();
  }

  Future<void> _loadOptions() async {
    setState(() => _isLoadingOptions = true);
    final repo = ref.read(appOptionsRepositoryProvider);
    final audiences = await repo.getTargetAudiences();
    var styles = await repo.getThemes('IKLAN');
    if (styles.isEmpty) styles = await repo.getDesignStyles();
    final characters = await repo.getCharacters();
    final productTypes = await repo.getDigitalProductTypes();

    if (mounted) {
      setState(() {
        _audiences = audiences;
        _designStyles = styles;
        _characters = characters;
        _productTypes = productTypes;
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
        if (productTypes.isNotEmpty) {
          _selectedProductType = productTypes.first.name;
        }
        _isLoadingOptions = false;
      });
    }
  }

  String? _resolveImageUrl(String? imageUrl) {
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

  void _openZoomDialog(int initialIndex, bool isStyle) {
    showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.85),
      builder: (context) {
        return _ZoomSelectorDialog(
          isStyle: isStyle,
          initialIndex: initialIndex,
          designStyles: _designStyles,
          characters: _characters,
          primaryStart: _primaryStart,
          primaryEnd: _primaryEnd,
          resolveImageUrl: _resolveImageUrl,
          onSelected: (id, name) {
            setState(() {
              if (isStyle) {
                _selectedDesignStyleId = id;
                _selectedDesignStyleName = name;
              } else {
                _selectedCharacterId = id;
              }
            });
          },
        );
      },
    );
  }

  @override
  void dispose() {
    _animController.dispose();
    _descController.dispose();
    _brandController.dispose();
    _priceController.dispose();
    _additionalPromptController.dispose();
    super.dispose();
  }

  Future<void> _pickProductImage() async {
    if (_productImages.length >= 3) {
      ToastMessage.showWarning(context, 'Maksimal 3 gambar.');
      return;
    }
    final picker = ImagePicker();
    final pickedFile =
        await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (pickedFile != null) {
      setState(() => _productImages.add(pickedFile));
    }
  }

  void _removeProductImage(int index) =>
      setState(() => _productImages.removeAt(index));

  Future<void> _generate() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedAudienceName == null || _selectedDesignStyleName == null) {
      ToastMessage.showError(
          context, 'Pilih Target Audiens dan Gaya Desain terlebih dahulu.');
      return;
    }

    setState(() => _isUploadingImage = true);
    _uploadedImageUrls.clear();

    try {
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
      ToastMessage.showError(context, 'Gagal mengunggah gambar: $e');
      setState(() => _isUploadingImage = false);
      return;
    }

    setState(() => _isUploadingImage = false);

    final productTitle = _brandController.text.isNotEmpty
        ? '${_brandController.text} - ${_descController.text.split(' ').take(3).join(' ')}'
        : _descController.text.split(' ').take(5).join(' ');

    await ref.read(promptProvider.notifier).generateDigitalProductPrompt(
          title: productTitle,
          slideCount: _slideCount.toString(),
          designStyle: _selectedDesignStyleName!,
          targetAudience: _selectedAudienceName!,
          description: _descController.text.trim(),
          brand: _brandController.text.trim().isEmpty
              ? null
              : _brandController.text.trim(),
          price: _priceController.text.trim().isEmpty
              ? null
              : _priceController.text.trim(),
          productType: _selectedProductType ?? 'E-book / Buku Digital',
          additionalPrompt:
              _additionalPromptController.text.trim().isEmpty
                  ? null
                  : _additionalPromptController.text.trim(),
          sourceImageUrl: _uploadedImageUrls.isNotEmpty
              ? _uploadedImageUrls.join(',')
              : null,
          includeCaption: _includeCaption,
          characterId: _useCharacter ? _selectedCharacterId : null,
          useCharacter: _useCharacter,
          color1: _selectedColor1,
          color2: _selectedColor2,
        );

    final pState = ref.read(promptProvider);
    if (!mounted) return;

    if (pState.generatedPrompt != null && pState.errorMessage == null) {
      context.replace('/prompt/${pState.generatedPrompt!.id}');
    } else if (pState.errorMessage != null) {
      ToastMessage.showError(context, pState.errorMessage!);
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
          backgroundColor: isDark ? const Color(0xFF0F0A1E) : const Color(0xFFF8F7FC),
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded),
              onPressed: () => context.pop(),
            ),
            title: ShaderMask(
              shaderCallback: (bounds) => const LinearGradient(
                colors: [_primaryStart, _primaryEnd],
              ).createShader(bounds),
              child: const Text(
                'Generator Produk Digital',
                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
              ),
            ),
          ),
          body: FadeTransition(
            opacity: _fadeAnim,
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // ── Gambar Produk ─────────────────────────────────────
                      _buildSectionHeader('📸 Gambar Produk', 'Upload preview/mockup produk (opsional, maks 3)'),
                      const SizedBox(height: 10),
                      _buildImageUploadArea(isDark),
                      const SizedBox(height: 20),

                      // ── Jenis Produk (Dropdown) ───────────────────────────
                      _buildSectionHeader('🗂️ Jenis Produk', 'Pilih kategori produk digital'),
                      const SizedBox(height: 10),
                      _buildProductTypeSelector(isDark),
                      const SizedBox(height: 20),

                      // ── Deskripsi ────────────────────────────────────────
                      _buildSectionHeader('📝 Deskripsi Produk', 'Ceritakan produk digital secara singkat'),
                      const SizedBox(height: 10),
                      CustomTextField(
                        controller: _descController,
                        labelText: 'Deskripsi Produk *',
                        hintText: 'Contoh: E-book strategi jualan di TikTok Shop untuk pemula...',
                        maxLines: 3,
                        validator: (v) => (v == null || v.trim().isEmpty)
                            ? 'Deskripsi produk wajib diisi'
                            : null,
                      ),
                      const SizedBox(height: 12),

                      // ── Brand & Harga ─────────────────────────────────────
                      Row(
                        children: [
                          Expanded(
                            child: CustomTextField(
                              controller: _brandController,
                              labelText: 'Nama Brand',
                              hintText: 'Contoh: Inka Digital',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: CustomTextField(
                              controller: _priceController,
                              labelText: 'Harga',
                              hintText: 'Contoh: Rp 97.000',
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),

                      // ── Target Audiens ───────────────────────────────────
                      _buildSectionHeader('🎯 Target Audiens', null),
                      const SizedBox(height: 10),
                      _isLoadingOptions
                          ? _buildLoadingChips()
                          : _buildAudienceChips(isDark),
                      const SizedBox(height: 20),

                      // ── Gaya Visual (Horizontal Preview List) ─────────────
                      _buildSectionHeader('🎨 Gaya Visual', null),
                      const SizedBox(height: 10),
                      _isLoadingOptions
                          ? _buildLoadingChips()
                          : _buildStyleSelector(isDark),
                      const SizedBox(height: 20),
                      // ── Warna Utama & Aksen (NEW) ──────────────────────────
                      _buildSectionHeader('🎨 Palet Warna Konten', 'Pilih paduan 2 warna utama untuk konten'),
                      const SizedBox(height: 10),
                      _buildColorDropdowns(isDark),
                      const SizedBox(height: 20),

                      // ── Jumlah Slide ─────────────────────────────────────
                      _buildSectionHeader('📊 Jumlah Slide', 'Slide 1 = COVER, Slide akhir = CTA'),
                      const SizedBox(height: 10),
                      _buildSlideCountSelector(isDark),
                      const SizedBox(height: 24),

                      // ── Advanced Options ─────────────────────────────────
                      _buildAdvancedToggle(isDark),
                      if (_showAdvancedOptions) ...[
                        const SizedBox(height: 12),
                        _buildAdvancedOptions(isDark),
                      ],

                      const SizedBox(height: 30),

                      // ── Generate Button ──────────────────────────────────
                      _buildGenerateButton(isGenerating),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
        // ── Loading Overlay ────────────────────────────────────────────────
        if (isGenerating)
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
              child: Container(
                color: Colors.black.withOpacity(0.6),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(colors: [_primaryStart, _primaryEnd]),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(Icons.auto_awesome_rounded, color: Colors.white, size: 40),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      'Membuat Prompting...',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),
                    const SizedBox(
                      width: 28,
                      height: 28,
                      child: CircularProgressIndicator(strokeWidth: 3, color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),
      ],
    );
  }

  // ─── Widget Builders ──────────────────────────────────────────────────────

  Widget _buildSectionHeader(String title, String? subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
        if (subtitle != null) ...[
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: const TextStyle(color: Colors.grey, fontSize: 11),
          ),
        ],
      ],
    );
  }

  Widget _buildImageUploadArea(bool isDark) {
    return Column(
      children: [
        if (_productImages.isNotEmpty) ...[
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _productImages.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final img = _productImages[index];
                return Stack(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: kIsWeb
                          ? FutureBuilder<Uint8List>(
                              future: img.readAsBytes(),
                              builder: (ctx, snap) => snap.hasData
                                  ? Image.memory(snap.data!, width: 90, height: 90, fit: BoxFit.cover)
                                  : const SizedBox(width: 90, height: 90, child: CircularProgressIndicator()),
                            )
                          : Image.file(File(img.path), width: 90, height: 90, fit: BoxFit.cover),
                    ),
                    Positioned(
                      top: 2,
                      right: 2,
                      child: GestureDetector(
                        onTap: () => _removeProductImage(index),
                        child: Container(
                          decoration: const BoxDecoration(color: Colors.red, shape: BoxShape.circle),
                          padding: const EdgeInsets.all(3),
                          child: const Icon(Icons.close, color: Colors.white, size: 12),
                        ),
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
          const SizedBox(height: 8),
        ],
        GestureDetector(
          onTap: _pickProductImage,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 16),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1535) : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _primaryStart.withOpacity(0.3), width: 1.5),
            ),
            child: Column(
              children: [
                Icon(Icons.add_photo_alternate_rounded, size: 28, color: _primaryStart.withOpacity(0.7)),
                const SizedBox(height: 6),
                Text(
                  _productImages.isEmpty ? 'Upload screenshot/mockup' : 'Tambah gambar (${_productImages.length}/3)',
                  style: TextStyle(color: isDark ? Colors.white60 : Colors.grey[600], fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProductTypeSelector(bool isDark) {
    if (_productTypes.isEmpty) {
      return Container(
        height: 48,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1535) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _primaryStart.withOpacity(0.3)),
        ),
        child: const Center(
          child: SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(strokeWidth: 2, color: _primaryStart),
          ),
        ),
      );
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1535) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _primaryStart.withOpacity(0.3)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          isExpanded: true,
          value: _selectedProductType,
          dropdownColor: isDark ? const Color(0xFF1E1535) : Colors.white,
          icon: const Icon(Icons.expand_more_rounded, color: _primaryStart),
          items: _productTypes.map((type) {
            return DropdownMenuItem(
              value: type.name,
              child: Text(
                type.name,
                style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
              ),
            );
          }).toList(),
          onChanged: (val) {
            if (val != null) setState(() => _selectedProductType = val);
          },
        ),
      ),
    );
  }

  Widget _buildAudienceChips(bool isDark) {
    return Wrap(
      spacing: 6,
      runSpacing: 6,
      children: _audiences.map((audience) {
        final isSelected = _selectedAudienceId == audience.id;
        return GestureDetector(
          onTap: () => setState(() {
            _selectedAudienceId = audience.id;
            _selectedAudienceName = audience.name;
          }),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              gradient: isSelected ? const LinearGradient(colors: [_primaryStart, _primaryEnd]) : null,
              color: isSelected ? null : isDark ? const Color(0xFF1E1535) : Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: isSelected ? Colors.transparent : _primaryStart.withOpacity(0.2),
              ),
            ),
            child: Text(
              audience.name,
              style: TextStyle(
                color: isSelected ? Colors.white : isDark ? Colors.white70 : Colors.grey[700],
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildStyleSelector(bool isDark) {
    if (_designStyles.isEmpty) {
      return Text('Gaya desain tidak ditemukan.', style: TextStyle(color: Colors.grey[500], fontSize: 12));
    }
    return SizedBox(
      height: 95,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _designStyles.length,
        itemBuilder: (context, index) {
          final style = _designStyles[index];
          final isSelected = _selectedDesignStyleId == style.id;
          return GestureDetector(
            onTap: () => _openZoomDialog(index, true),
            child: Container(
              width: 90,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? _primaryStart : Colors.transparent,
                  width: 2.5,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(9.5),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (style.imageUrl != null && style.imageUrl!.isNotEmpty)
                      Image.network(
                        _resolveImageUrl(style.imageUrl)!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: isDark ? const Color(0xFF1E1535) : Colors.grey[300],
                          child: Icon(Icons.palette_rounded, color: _primaryStart.withOpacity(0.7)),
                        ),
                      )
                    else
                      Container(
                        color: isDark ? const Color(0xFF1E1535) : Colors.grey[300],
                        child: Icon(Icons.palette_rounded, color: _primaryStart.withOpacity(0.7)),
                      ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.transparent, Colors.black.withOpacity(0.75)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 4,
                      left: 4,
                      right: 4,
                      child: Text(
                        style.name,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSlideCountSelector(bool isDark) {
    return Row(
      children: List.generate(4, (i) {
        final count = i + 2; // 2, 3, 4, 5
        final isSelected = _slideCount == count;
        return Expanded(
          child: GestureDetector(
            onTap: () => setState(() => _slideCount = count),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 150),
              margin: EdgeInsets.only(right: i < 3 ? 8 : 0),
              padding: const EdgeInsets.symmetric(vertical: 10),
              decoration: BoxDecoration(
                gradient: isSelected ? const LinearGradient(colors: [_primaryStart, _primaryEnd]) : null,
                color: isSelected ? null : isDark ? const Color(0xFF1E1535) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? Colors.transparent : _primaryStart.withOpacity(0.2),
                ),
              ),
              child: Column(
                children: [
                  Text(
                    '$count',
                    style: TextStyle(
                      color: isSelected ? Colors.white : isDark ? Colors.white : Colors.black87,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    'Slide',
                    style: TextStyle(
                      color: isSelected ? Colors.white70 : isDark ? Colors.white54 : Colors.grey[500],
                      fontSize: 10,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }),
    );
  }

  Widget _buildAdvancedToggle(bool isDark) {
    return GestureDetector(
      onTap: () => setState(() => _showAdvancedOptions = !_showAdvancedOptions),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1535) : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: _primaryStart.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            const Icon(Icons.tune_rounded, color: _primaryStart, size: 18),
            const SizedBox(width: 10),
            const Text(
              'Opsi Lanjutan (Karakter & Prompt)',
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
            ),
            const Spacer(),
            Icon(
              _showAdvancedOptions ? Icons.expand_less_rounded : Icons.expand_more_rounded,
              color: Colors.grey,
              size: 18,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdvancedOptions(bool isDark) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1535) : const Color(0xFFF2EFFF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _primaryStart.withOpacity(0.15)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Karakter toggle
          if (_characters.isNotEmpty) ...[
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Karakter Konsisten', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                      Text(
                        'AI membuat visual dengan tokoh tetap',
                        style: TextStyle(color: Colors.grey[500], fontSize: 11),
                      ),
                    ],
                  ),
                ),
                Switch.adaptive(
                  value: _useCharacter,
                  onChanged: (v) => setState(() => _useCharacter = v),
                  activeColor: _primaryStart,
                ),
              ],
            ),
            if (_useCharacter) ...[
              const SizedBox(height: 10),
              _buildCharacterSelector(isDark),
            ],
            const SizedBox(height: 10),
            const Divider(height: 1),
            const SizedBox(height: 10),
          ],
          // Prompt tambahan
          const Text('Instruksi Tambahan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          CustomTextField(
            controller: _additionalPromptController,
            labelText: 'Petunjuk Khusus',
            hintText: 'Contoh: Gunakan warna ungu-emas...',
            maxLines: 2,
          ),
          const SizedBox(height: 10),
          // Caption toggle
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Buat Caption Media Sosial', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Text(
                      'Tulis caption + hashtag otomatis',
                      style: TextStyle(color: Colors.grey[500], fontSize: 11),
                    ),
                  ],
                ),
              ),
              Switch.adaptive(
                value: _includeCaption,
                onChanged: (v) => setState(() => _includeCaption = v),
                activeColor: _primaryStart,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCharacterSelector(bool isDark) {
    if (_characters.isEmpty) {
      return Text('Karakter tidak ditemukan.', style: TextStyle(color: Colors.grey[500], fontSize: 12));
    }
    return SizedBox(
      height: 95,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _characters.length,
        itemBuilder: (context, index) {
          final char = _characters[index];
          final isSelected = _selectedCharacterId == char.id;
          return GestureDetector(
            onTap: () => _openZoomDialog(index, false),
            child: Container(
              width: 90,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected ? _primaryStart : Colors.transparent,
                  width: 2.5,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(9.5),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (char.imageUrl != null && char.imageUrl!.isNotEmpty)
                      Image.network(
                        _resolveImageUrl(char.imageUrl)!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: isDark ? const Color(0xFF1E1535) : Colors.grey[300],
                          child: Icon(Icons.person_rounded, color: _primaryStart.withOpacity(0.7)),
                        ),
                      )
                    else
                      Container(
                        color: isDark ? const Color(0xFF1E1535) : Colors.grey[300],
                        child: Icon(Icons.person_rounded, color: _primaryStart.withOpacity(0.7)),
                      ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.transparent, Colors.black.withOpacity(0.75)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 4,
                      left: 4,
                      right: 4,
                      child: Text(
                        char.name,
                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildGenerateButton(bool isGenerating) {
    return SizedBox(
      width: double.infinity,
      child: GestureDetector(
        onTap: isGenerating ? null : _generate,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            gradient: isGenerating
                ? null
                : const LinearGradient(
                    colors: [_primaryStart, _primaryEnd],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
            color: isGenerating ? Colors.grey[400] : null,
            borderRadius: BorderRadius.circular(14),
            boxShadow: isGenerating
                ? null
                : [
                    BoxShadow(
                      color: _primaryStart.withOpacity(0.3),
                      blurRadius: 12,
                      offset: const Offset(0, 5),
                    ),
                  ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.auto_awesome_rounded, color: Colors.white, size: 18),
              const SizedBox(width: 8),
              Text(
                isGenerating ? 'Mengekstrak...' : 'Generate',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingChips() {
    return const SizedBox(
      height: 36,
      child: Center(
        child: SizedBox(
          width: 20,
          height: 20,
          child: CircularProgressIndicator(strokeWidth: 2, color: _primaryStart),
        ),
      ),
    );
  }

  DropdownMenuItem<String> _buildColorDropdownItem(ColorOption opt, bool isDark) {
    return DropdownMenuItem<String>(
      value: opt.label,
      child: Row(
        children: [
          Container(
            width: 16,
            height: 16,
            decoration: BoxDecoration(
              color: opt.hexColor,
              shape: BoxShape.circle,
              border: Border.all(
                color: opt.hexColor == Colors.white
                    ? Colors.grey
                    : opt.hexColor == Colors.black && isDark
                        ? Colors.white54
                        : Colors.transparent,
                width: 1,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            opt.label,
            style: TextStyle(color: isDark ? Colors.white : Colors.black87, fontSize: 13),
          ),
        ],
      ),
    );
  }

  Widget _buildColorDropdowns(bool isDark) {
    return Row(
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Warna Utama',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : Colors.grey[800]),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1535) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _primaryStart.withOpacity(0.3)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    isExpanded: true,
                    value: _selectedColor1,
                    dropdownColor: isDark ? const Color(0xFF1E1535) : Colors.white,
                    icon: const Icon(Icons.expand_more_rounded, color: _primaryStart, size: 20),
                    items: _colorOptions.map((opt) => _buildColorDropdownItem(opt, isDark)).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedColor1 = val);
                      }
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Warna Kedua',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: isDark ? Colors.white70 : Colors.grey[800]),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1535) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _primaryStart.withOpacity(0.3)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    isExpanded: true,
                    value: _selectedColor2,
                    dropdownColor: isDark ? const Color(0xFF1E1535) : Colors.white,
                    icon: const Icon(Icons.expand_more_rounded, color: _primaryStart, size: 20),
                    items: _colorOptions.map((opt) => _buildColorDropdownItem(opt, isDark)).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() => _selectedColor2 = val);
                      }
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _ZoomSelectorDialog extends StatefulWidget {
  final bool isStyle;
  final int initialIndex;
  final List<DesignStyle> designStyles;
  final List<Character> characters;
  final Color primaryStart;
  final Color primaryEnd;
  final String? Function(String?) resolveImageUrl;
  final Function(String id, String name) onSelected;

  const _ZoomSelectorDialog({
    required this.isStyle,
    required this.initialIndex,
    required this.designStyles,
    required this.characters,
    required this.primaryStart,
    required this.primaryEnd,
    required this.resolveImageUrl,
    required this.onSelected,
  });

  @override
  State<_ZoomSelectorDialog> createState() => _ZoomSelectorDialogState();
}

class _ZoomSelectorDialogState extends State<_ZoomSelectorDialog> {
  late PageController _pageController;
  late int _currentIndex;

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
    _pageController = PageController(initialPage: widget.initialIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  int get _totalCount => widget.isStyle ? widget.designStyles.length : widget.characters.length;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    final size = MediaQuery.of(context).size;

    return Center(
      child: Container(
        width: size.width > 500 ? 460 : size.width * 0.9,
        constraints: BoxConstraints(
          maxHeight: size.height * 0.85,
        ),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E1535) : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: widget.primaryStart.withOpacity(0.2)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.5),
              blurRadius: 20,
              offset: const Offset(0, 10),
            )
          ],
        ),
        child: Material(
          color: Colors.transparent,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
            children: [
              // ── Header Bar ──────────────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 12, 8),
                child: Row(
                  children: [
                    Text(
                      widget.isStyle ? 'Preview Gaya Visual' : 'Preview Karakter',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                    ),
                    const Spacer(),
                    IconButton(
                      icon: const Icon(Icons.close_rounded),
                      color: isDark ? Colors.white54 : Colors.grey[600],
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ),

              // ── Swipeable PageView ──────────────────────────────────────────
              SizedBox(
                height: 280,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    PageView.builder(
                      controller: _pageController,
                      itemCount: _totalCount,
                      onPageChanged: (idx) => setState(() => _currentIndex = idx),
                      itemBuilder: (context, index) {
                        final String? rawImgUrl = widget.isStyle
                            ? widget.designStyles[index].imageUrl
                            : widget.characters[index].imageUrl;
                        final resolvedImg = widget.resolveImageUrl(rawImgUrl);

                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: resolvedImg != null && resolvedImg.isNotEmpty
                                ? Image.network(
                                    resolvedImg,
                                    fit: BoxFit.contain,
                                    loadingBuilder: (ctx, child, progress) {
                                      if (progress == null) return child;
                                      return Center(
                                        child: CircularProgressIndicator(
                                          value: progress.expectedTotalBytes != null
                                              ? progress.cumulativeBytesLoaded / progress.expectedTotalBytes!
                                              : null,
                                          strokeWidth: 2,
                                          color: widget.primaryStart,
                                        ),
                                      );
                                    },
                                    errorBuilder: (_, __, ___) => Container(
                                      color: isDark ? Colors.black38 : Colors.grey[200],
                                      child: Icon(
                                        widget.isStyle ? Icons.palette_rounded : Icons.person_rounded,
                                        size: 64,
                                        color: widget.primaryStart.withOpacity(0.5),
                                      ),
                                    ),
                                  )
                                : Container(
                                    color: isDark ? Colors.black38 : Colors.grey[200],
                                    child: Icon(
                                      widget.isStyle ? Icons.palette_rounded : Icons.person_rounded,
                                      size: 64,
                                      color: widget.primaryStart.withOpacity(0.5),
                                    ),
                                  ),
                          ),
                        );
                      },
                    ),

                    // Left & Right Swipe Chevrons (only show if count > 1)
                    if (_totalCount > 1) ...[
                      if (_currentIndex > 0)
                        Positioned(
                          left: 20,
                          child: GestureDetector(
                            onTap: () {
                              _pageController.previousPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.5),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.chevron_left_rounded, color: Colors.white, size: 24),
                            ),
                          ),
                        ),
                      if (_currentIndex < _totalCount - 1)
                        Positioned(
                          right: 20,
                          child: GestureDetector(
                            onTap: () {
                              _pageController.nextPage(
                                duration: const Duration(milliseconds: 300),
                                curve: Curves.easeInOut,
                              );
                            },
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.5),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.chevron_right_rounded, color: Colors.white, size: 24),
                            ),
                          ),
                        ),
                    ],
                  ],
                ),
              ),

              // ── Details Container ───────────────────────────────────────────
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Item Name
                    Text(
                      widget.isStyle
                          ? widget.designStyles[_currentIndex].name
                          : widget.characters[_currentIndex].name,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: isDark ? Colors.white : Colors.black87,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),

                    // Description / Prompt
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isDark ? Colors.black26 : Colors.grey[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        widget.isStyle
                            ? (widget.designStyles[_currentIndex].description ?? 'Tidak ada deskripsi gaya.')
                            : (widget.characters[_currentIndex].prompt),
                        maxLines: 4,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 12,
                          color: isDark ? Colors.white70 : Colors.grey[700],
                          height: 1.4,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Page Indicator / Dot count
                    Text(
                      '${_currentIndex + 1} / $_totalCount',
                      style: const TextStyle(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 16),

                    // Select Button
                    SizedBox(
                      width: double.infinity,
                      child: GestureDetector(
                        onTap: () {
                          if (widget.isStyle) {
                            final selected = widget.designStyles[_currentIndex];
                            widget.onSelected(selected.id, selected.name);
                          } else {
                            final selected = widget.characters[_currentIndex];
                            widget.onSelected(selected.id, selected.name);
                          }
                          Navigator.of(context).pop();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [widget.primaryStart, widget.primaryEnd],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: Center(
                            child: Text(
                              widget.isStyle ? 'Pilih Gaya Desain Ini' : 'Pilih Karakter Ini',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
  }
}
