import 'dart:convert' as dart_convert;

/// Represents one AI-generated slide with fully structured fields
class PromptSlide {
  final int slideNumber;
  final int totalSlides;
  final String role;
  final String peran;
  final String instruksi;
  final String gayaDominan;
  final String deskripsiVisual;
  final String headline;
  final String subtext;
  final String detail;
  final String microTip;
  final String nomorSlide;
  final String negativePrompt;
  final String aturanPermanen;
  final String mediaSosialAturan;
  final String instruksiAwalWajib;

  PromptSlide({
    required this.slideNumber,
    required this.totalSlides,
    required this.role,
    this.peran = 'Kamu adalah Senior Graphic Designer yang mengetahui kombinasi warna dan estetika visual.',
    this.instruksi = 'Buatkan saya gambar baru dengan deskripsi berikut:',
    this.gayaDominan = '',
    this.deskripsiVisual = '',
    this.headline = '',
    this.subtext = '',
    this.detail = '',
    this.microTip = '',
    this.nomorSlide = '',
    this.negativePrompt = '',
    this.aturanPermanen = '',
    this.mediaSosialAturan = '',
    this.instruksiAwalWajib = '',
  });

  factory PromptSlide.fromJson(Map<String, dynamic> json) {
    // Check if new schema exists
    final teksDalamGambar = json['teks_dalam_gambar'] as Map<String, dynamic>? ?? {};
    
    // Fallback parsing for legacy records
    final legacyContent = json['content'] as Map<String, dynamic>? ?? {};
    final legacyImagePrompt = json['imagePrompt'] as Map<String, dynamic>? ?? {};

    return PromptSlide(
      slideNumber: json['slideNumber'] as int? ?? 1,
      totalSlides: json['totalSlides'] as int? ?? 1,
      role: json['role'] as String? ?? '',
      peran: json['peran'] as String? ?? 'Kamu adalah Senior Graphic Designer yang mengetahui kombinasi warna dan estetika visual.',
      instruksi: json['instruksi'] as String? ?? 'Buatkan saya gambar baru dengan deskripsi berikut:',
      gayaDominan: json['gaya_dominan'] as String? ?? legacyImagePrompt['gaya_dominan'] as String? ?? '',
      deskripsiVisual: json['deskripsi_visual'] as String? ?? json['objek_visual'] as String? ?? legacyImagePrompt['fullPrompt'] as String? ?? '',
      headline: teksDalamGambar['headline'] as String? ?? legacyContent['headline'] as String? ?? '',
      subtext: teksDalamGambar['subtext'] as String? ?? legacyContent['subtext'] as String? ?? '',
      detail: teksDalamGambar['detail'] as String? ?? legacyContent['detail'] as String? ?? '',
      microTip: teksDalamGambar['microTip'] as String? ?? legacyContent['microTip'] as String? ?? '',
      nomorSlide: teksDalamGambar['nomor_slide'] as String? ?? '${json['slideNumber'] ?? 1} dari ${json['totalSlides'] ?? 1}',
      negativePrompt: json['negative_prompt'] as String? ?? legacyImagePrompt['negativePrompt'] as String? ?? '',
      aturanPermanen: json['aturan_permanen'] as String? ?? '',
      mediaSosialAturan: json['media_sosial_aturan'] as String? ?? '',
      instruksiAwalWajib: json['instruksi_awal_wajib'] as String? ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'instruksi_awal_wajib': instruksiAwalWajib,
    'slideNumber': slideNumber,
    'totalSlides': totalSlides,
    'role': role,
    'peran': peran,
    'instruksi': instruksi,
    'gaya_dominan': gayaDominan,
    'deskripsi_visual': deskripsiVisual,
    'teks_dalam_gambar': {
      'headline': headline,
      'subtext': subtext,
      'detail': detail,
      'microTip': microTip,
      'nomor_slide': nomorSlide,
    },
    'aturan_permanen': aturanPermanen,
    'media_sosial_aturan': mediaSosialAturan,
    'negative_prompt': negativePrompt,
  };

  /// Returns full content as copyable text
  String toCopyText() {
    final encoder = const dart_convert.JsonEncoder.withIndent('  ');
    return encoder.convert(toJson());
  }
}

class PromptHistory {
  final String id;
  final String? userId;
  final String title;
  final String contentType;
  final int slideCount;
  final String designStyle;
  final String targetAudience;
  final String language;
  final String? generatedPrompt;
  final String createdAt;
  final String? updatedAt;
  final bool isFavorite;
  final List<String> imageUrls;
  final String imageOrientation;
  final String instagramCaption;
  final String tiktokCaption;
  final String hashtags;
  final String? sourceImageUrl;

  /// Parsed structured slides — populated if generatedPrompt is valid JSON
  final List<PromptSlide> slides;

  PromptHistory({
    required this.id,
    this.userId,
    required this.title,
    required this.contentType,
    required this.slideCount,
    required this.designStyle,
    required this.targetAudience,
    this.language = 'ID',
    this.generatedPrompt,
    required this.createdAt,
    this.updatedAt,
    this.isFavorite = false,
    this.imageUrls = const [],
    this.imageOrientation = 'Persegi (Square 1:1)',
    this.instagramCaption = '',
    this.tiktokCaption = '',
    this.hashtags = '',
    this.sourceImageUrl,
    this.slides = const [],
  });

  bool get hasStructuredSlides => slides.isNotEmpty;

  factory PromptHistory.fromJson(Map<String, dynamic> json) {
    final fav = json['favoritePrompt'];
    List<String> parsedImages = [];
    if (json['imageUrl'] != null && json['imageUrl'].toString().isNotEmpty) {
      try {
        final decodedImg = dart_convert.jsonDecode(json['imageUrl'].toString());
        if (decodedImg is List) {
          parsedImages = decodedImg.map((e) => e.toString()).toList();
        } else {
          parsedImages = [json['imageUrl'].toString()];
        }
      } catch (e) {
        parsedImages = [json['imageUrl'].toString()];
      }
    }

    // Parse structured slides from generatedPrompt JSON
    List<PromptSlide> parsedSlides = [];
    final rawPrompt = json['generatedPrompt'] as String?;
    if (rawPrompt != null) {
      final trimmed = rawPrompt.trim();
      if (trimmed.startsWith('[')) {
        try {
          final decoded = dart_convert.jsonDecode(trimmed);
          if (decoded is List) {
            parsedSlides = decoded
                .map((e) => PromptSlide.fromJson(e as Map<String, dynamic>))
                .toList();
          }
        } catch (_) {}
      } else if (trimmed.startsWith('{')) {
        try {
          final decoded = dart_convert.jsonDecode(trimmed);
          if (decoded is Map<String, dynamic>) {
            final dynamic slidesData = decoded['daftar_slide'] ?? decoded['slides'];
            if (slidesData is List) {
              final total = slidesData.length;
              final globalNegativePrompt = decoded['gaya_visual_global']?['negative_prompt'] as String?;
              final globalPeran = decoded['aturan_global']?['peran'] as String?;
              final globalGayaDominan = decoded['gaya_visual_global']?['gaya_dominan'] as String?;
              final globalAturanGlobal = decoded['aturan_global'] as Map<String, dynamic>?;
              final globalLayoutMediaSosial = decoded['layout_media_sosial_global'] as Map<String, dynamic>?;

              // Construct media social rules text
              String mediaSosialText = '';
              if (globalLayoutMediaSosial != null) {
                mediaSosialText = [
                  if (globalLayoutMediaSosial['pojok_kiri_atas'] != null) 'Pojok Kiri Atas: ${globalLayoutMediaSosial['pojok_kiri_atas']}',
                  if (globalLayoutMediaSosial['pojok_kanan_atas'] != null) 'Pojok Kanan Atas: ${globalLayoutMediaSosial['pojok_kanan_atas']}',
                  if (globalLayoutMediaSosial['tengah_atas_footer'] != null) 'Navigasi: ${globalLayoutMediaSosial['tengah_atas_footer']}',
                  if (globalLayoutMediaSosial['footer_bawah'] != null) 'Footer: ${globalLayoutMediaSosial['footer_bawah']}',
                ].join('\n');
              }

              // Construct permanent rules text
              String aturanPermanenText = '';
              if (globalAturanGlobal != null) {
                aturanPermanenText = [
                  if (globalAturanGlobal['target_audiens'] != null) 'Target Audiens: ${globalAturanGlobal['target_audiens']}',
                  if (globalAturanGlobal['jenis_konten'] != null) 'Jenis Konten: ${globalAturanGlobal['jenis_konten']}',
                  if (globalAturanGlobal['bahasa_teks_overlay'] != null) 'Bahasa Teks: ${globalAturanGlobal['bahasa_teks_overlay']}',
                  if (globalAturanGlobal['batas_teks'] != null) 'Batas Teks: ${globalAturanGlobal['batas_teks']}',
                  if (globalAturanGlobal['larangan'] != null) 'Larangan: ${globalAturanGlobal['larangan']}',
                ].join('\n');
              }

              parsedSlides = slidesData.map((e) {
                final Map<String, dynamic> map = Map<String, dynamic>.from(e as Map);
                if (!map.containsKey('totalSlides')) {
                  map['totalSlides'] = total;
                }
                if (globalNegativePrompt != null && !map.containsKey('negative_prompt')) {
                  map['negative_prompt'] = globalNegativePrompt;
                }
                if (globalPeran != null && !map.containsKey('peran')) {
                  map['peran'] = globalPeran;
                }
                if (globalGayaDominan != null && !map.containsKey('gaya_dominan')) {
                  map['gaya_dominan'] = globalGayaDominan;
                }
                if (mediaSosialText.isNotEmpty && !map.containsKey('media_sosial_aturan')) {
                  map['media_social_aturan'] = mediaSosialText;
                  map['media_sosial_aturan'] = mediaSosialText;
                }
                if (aturanPermanenText.isNotEmpty && !map.containsKey('aturan_permanen')) {
                  map['aturan_permanen'] = aturanPermanenText;
                }
                return PromptSlide.fromJson(map);
              }).toList();
            }
          }
        } catch (_) {}
      }
    }

    return PromptHistory(
      id: json['id'] as String,
      userId: json['userId'] as String?,
      title: json['title'] as String,
      contentType: json['contentType'] as String,
      slideCount: json['slideCount'] as int? ?? 1,
      designStyle: json['designStyle'] as String,
      targetAudience: json['targetAudience'] as String,
      language: json['language'] as String? ?? 'ID',
      generatedPrompt: rawPrompt,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String?,
      isFavorite: json['isFavorite'] ?? (fav != null),
      imageUrls: parsedImages,
      imageOrientation: json['imageOrientation'] as String? ?? 'Persegi (Square 1:1)',
      instagramCaption: json['instagramCaption'] as String? ?? '',
      tiktokCaption: json['tiktokCaption'] as String? ?? '',
      hashtags: json['hashtags'] as String? ?? '',
      sourceImageUrl: json['sourceImageUrl'] as String?,
      slides: parsedSlides,
    );
  }
}
