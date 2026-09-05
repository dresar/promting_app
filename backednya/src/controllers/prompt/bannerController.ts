import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation, callGroqVisionApiWithRotation } from './groqService';
import { generateSocialCaptions, buildPromptFallback, formatSlideOutput, getStylePromptText, getStyleAttributes } from './promptHelpers';

const getBannerLayoutSpec = (layout: string): { ratio: string; widthHint: string; spec: string } => {
  const lower = layout.toLowerCase();
  if (lower.includes('3:1') || lower.includes('spanduk horizontal')) {
    return {
      ratio: '3:1',
      widthHint: '3000x1000',
      spec: 'Spanduk Horizontal (3:1) — Canvas: 3000x1000px, Aspect Ratio: 3:1. Safe Area: Sisakan ruang sekitar 120–150 px dari setiap sisi batas luar agar seluruh teks utama, penawaran, dan kontak aman dari potongan mesin cetak.',
    };
  } else if (lower.includes('4:1') || lower.includes('spanduk panjang')) {
    return {
      ratio: '4:1',
      widthHint: '4000x1000',
      spec: 'Spanduk Panjang (4:1) — Canvas: 4000x1000px, Aspect Ratio: 4:1. Safe Area: Sisakan ruang sekitar 120–150 px dari setiap sisi batas luar agar seluruh teks utama, penawaran, dan kontak aman dari potongan mesin cetak.',
    };
  } else if (lower.includes('2:3') || lower.includes('x-banner') || lower.includes('standing')) {
    return {
      ratio: '2:3',
      widthHint: '1200x1800',
      spec: 'Vertical X-Banner (2:3) vertikal berdiri — Canvas: 1200x1800px, Aspect Ratio: 2:3. Safe Area: Sisakan ruang sekitar 100–120 px dari sisi batas luar agar teks aman dari stand banner.',
    };
  } else if (lower.includes('16:9') || lower.includes('billboard') || lower.includes('baliho')) {
    return {
      ratio: '16:9',
      widthHint: '1920x1080',
      spec: 'Billboard Baliho Raksasa (16:9) — Canvas: 1920x1080px, Aspect Ratio: 16:9. Safe Area: Sisakan ruang sekitar 150–200 px dari tepi agar terbaca dengan baik dari kejauhan.',
    };
  } else {
    // Default to Square Banner (1:1)
    return {
      ratio: '1:1',
      widthHint: '1080x1080',
      spec: 'Square Banner (1:1) persegi — Canvas: 1080x1080px, Aspect Ratio: 1:1. Safe Area: Sisakan ruang sekitar 80–120 px dari setiap sisi batas luar.',
    };
  }
};

export const generateBannerPrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    title,          // e.g. "Doorsmeer Auto Clean"
    contentType,    // e.g. "Banner Spanduk"
    businessType,   // e.g. "Doorsmeer Cuci Mobil"
    designStyle,    // e.g. "Modern", "Retro", "Minimalis"
    description,    // e.g. "Cuci hidrolik salju, poles bodi, free coffee"
    layoutSize,     // e.g. "Spanduk Horizontal (3:1) - Canvas: 3000x1000px"
    contactInfo,    // e.g. "Hubungi: 0812-3456-7890, IG: @doorsmeer.clean"
    includeCaption,
    sourceImageUrl  // Reference image URL (from user upload)
  } = req.body;

  if (!title || !businessType || !description || !designStyle || !layoutSize) {
    return res.status(400).json({ message: 'Missing required parameters. Semua input utama wajib diisi.' });
  }

  const layoutSpec = getBannerLayoutSpec(layoutSize);
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== 'false';

  // Parse reference image URLs
  let imageUrls: string[] = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0);
  } else if (typeof sourceImageUrl === 'string' && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
  }

  // Step 1: Analisis Gambar Referensi (Jika ada)
  let referenceAnalysis = '';
  if (imageUrls.length > 0) {
    const analysisPrompt = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Kamu adalah asisten AI desainer grafis profesional ahli spanduk/banner promosi.
Analisis gambar referensi desain yang diunggah oleh user di bawah ini.
1. Identifikasi struktur tata letak (layout): letak judul, letak info kontak, pembagian area visual.
2. Identifikasi harmoni warna: warna latar belakang, warna teks, warna highlight.
3. Sebutkan kelebihan/estetika layout ini yang bisa ditiru agar spanduk baru terlihat profesional dan premium.
Tulis analisis desain singkat yang rapi.`
          },
          ...imageUrls.map(url => ({
            type: 'image_url',
            image_url: {
              url
            }
          }))
        ] as any[]
      }
    ];

    try {
      referenceAnalysis = await callGroqVisionApiWithRotation(analysisPrompt, 'llama-4-scout-17b-16e-instruct');
    } catch (e) {
      console.error('Vision analysis on banner layout reference failed:', e);
      referenceAnalysis = 'Gaya visual modern dengan penekanan pada teks headline besar dan ikon minimalis.';
    }
  }

  const stylePromptText = await getStylePromptText(designStyle);
  let finalSlide: any = null;

  let contextKreatif = `\nInformasi Bisnis Banner:\n- Nama Bisnis: ${title}\n- Jenis Usaha: ${businessType}\n- Detail & Layanan: ${description}\n- Kontak/Lokasi: ${contactInfo || '-'}\n`;
  if (referenceAnalysis) {
    contextKreatif += `- Hasil Analisis Gambar Referensi: ${referenceAnalysis}\n`;
  }

  // Construct banner prompt instruction
  const promptInstruction = `Kamu adalah Senior Graphic Designer, Ahli Tipografi, dan Pembuat Spanduk Cetak Profesional.
Buat data desain untuk 1 BANNER/SPANDUK bisnis premium.
Nama Bisnis: "${title}" | Jenis Usaha: "${businessType}" | Detail: "${description}"

=== ATURAN WAJIB DESAIN BANNER (HARUS DIPATUHI 100%) ===
1. DIMENSI & ASPECT RATIO: Gunakan ukuran ${layoutSpec.spec}. Posisikan teks secara strategis agar tidak terpotong saat proses cetak dan finishing.
2. TATA LETAK & KETERBACAAN:
   - Nama Bisnis/Headline harus menjadi elemen TERBESAR (dominan) yang bisa dibaca jelas dari jarak 10-20 meter.
   - Posisikan Info Kontak di bagian bawah secara rapi dan profesional.
3. GAYA DESAIN: Ikuti gaya "${designStyle}". ${stylePromptText ? 'Padukan dengan visual panduan: ' + stylePromptText : ''}
4. KOSONGKAN teks penjelasan panjang. Spanduk media luar ruang harus ringkas dan langsung dipahami dalam 3 detik.
5. REFERENSI GAMBAR (PENTING):
   ${imageUrls.length > 0 ? `User telah mengunggah gambar referensi. Di dalam hasil akhir prompa gambar visual (visual prompt), kamu wajib menyisipkan kalimat ini secara persis: "Saya akan merekomendasikan gambar ini" untuk merujuk pada gambar referensi layout yang akan dikirim user ke ChatGPT Image.` : 'Jika user ingin meniru gaya spanduk tertentu, beri rekomendasi ruang visual.'}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "headline": "[Nama Bisnis/Judul Banner Utama — bold, kontras tinggi, maks 6 kata]",
  "subtext": "[Sub-headline / Tagline promosi menarik — maks 8 kata]",
  "detail": "[Ringkasan Layanan/Poin Unggulan Singkat — pisahkan dengan tanda koma, maks 12 kata]",
  "contact": "[Informasi Alamat / Telepon / Medsos — maks 10 kata]",
  "imagePrompt": {
    "visual": "[Deskripsi detail visual utama yang harus digambar. Jelaskan komposisi spanduk secara lengkap, latar belakang, dan penempatan objek. ${imageUrls.length > 0 ? 'Sertakan kalimat wajib ini di akhir deskripsi visual: "Saya akan merekomendasikan gambar ini"' : ''}]",
    "negativePrompt": "[Negative prompt: watermark, blur, gambar pecah, teks tidak terbaca, typo]"
  }
}`;

  let generatedPrompt = '';
  try {
    const aiResult = await callGroqApiWithRotation(promptInstruction);
    if (aiResult) {
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);

          const buildVisualPrompt = (style: string, visual: string) => {
            let prompt = `[SPANDUK/BANNER DESAIN BLUEPRINT]\n`;
            prompt += `[GAYA VISUAL]: ${style.trim()}\n`;
            prompt += `[KOMPOSISI VISUAL]: ${visual.trim()}\n`;
            prompt += `[DIMENSI CANVAS]: Canvas ${layoutSpec.widthHint}px, Aspect Ratio ${layoutSpec.ratio} (--ar ${layoutSpec.ratio})`;
            return prompt;
          };

          // Wrap inside 1-slide array representation for full database & mobile app compatibility
          const slideOutput = formatSlideOutput({
            slideNumber: 1,
            totalSlides: 1,
            role: "BANNER UTAMA",
            designStyleName: designStyle,
            orientationSpec: {
              ratio: layoutSpec.ratio,
              widthHint: layoutSpec.widthHint,
              spec: layoutSpec.spec
            },
            stylePromptText,
            visualContent: parsed.imagePrompt?.visual ?? '',
            negativePrompt: parsed.imagePrompt?.negativePrompt ?? 'low quality, blurry, pixelated, noisy image, cluttered, low contrast',
            headline: parsed.headline ?? title,
            subtext: parsed.subtext ?? '',
            detail: parsed.detail ?? description,
            microTip: parsed.contact ?? contactInfo ?? '',
            isPromotional: true,
            targetAudience: 'Pelanggan Umum',
            mandatoryRules: `Gunakan ukuran layout ${layoutSpec.ratio}. Letakkan judul paling mencolok, detail layanan terstruktur di bagian tengah, dan info kontak di footer banner. Berikan safe area minimal 120-150px dari batas tepi agar tidak terpotong saat cetak spanduk.`,
            mediaSosialAturan: contactInfo ? `Tampilkan info kontak di bagian bawah banner secara rapi: ${contactInfo}` : ''
          });

          finalSlide = slideOutput;
        } catch (parseErr) {
          throw parseErr;
        }
      } else {
        throw new Error("No JSON bracket found");
      }
    } else {
      throw new Error("Empty response from Groq");
    }
  } catch (err: any) {
    console.error('Banner generator error, compiling fallback:', err);
    finalSlide = formatSlideOutput({
      slideNumber: 1,
      totalSlides: 1,
      role: "BANNER UTAMA",
      designStyleName: designStyle,
      orientationSpec: {
        ratio: layoutSpec.ratio,
        widthHint: layoutSpec.widthHint,
        spec: layoutSpec.spec
      },
      stylePromptText,
      visualContent: 'Desain spanduk minimalis modern yang menonjolkan nama bisnis di tengah.',
      negativePrompt: 'low quality, blurry, pixelated, noisy image, cluttered, low contrast',
      headline: title,
      subtext: '',
      detail: description,
      microTip: contactInfo || '',
      isPromotional: true,
      targetAudience: 'Pelanggan Umum',
      mandatoryRules: `Gunakan ukuran layout ${layoutSpec.ratio}. Letakkan judul paling mencolok, detail layanan terstruktur di bagian tengah, dan info kontak di footer banner. Berikan safe area minimal 120-150px dari batas tepi agar tidak terpotong saat cetak spanduk.`,
      mediaSosialAturan: contactInfo ? `Tampilkan info kontak di bagian bawah banner secara rapi: ${contactInfo}` : ''
    });
  }

  const styleName = designStyle.split('|')[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);

  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: "Pelanggan Umum",
      jenis_konten: "Banner Promosi",
      larangan: "DILARANG KERAS menggunakan foto berkualitas rendah atau melanggar safe area."
    },
    gaya_visual_global: {
      gaya_dominan: styleAttributes.gaya_dominan,
      gaya_visual_wajib: styleAttributes.gaya_visual_wajib,
      layout_dan_hierarki: styleAttributes.layout_dan_hierarki,
      elemen_pendukung: styleAttributes.elemen_infografis_pendukung,
      palet_warna: styleAttributes.palet_warna,
      tipografi: styleAttributes.tipografi,
      pencahayaan_kamera: styleAttributes.pencahayaan_dan_kamera,
      kedalaman_visual: styleAttributes.kedalaman_visual,
      dimensi_canvas: `Canvas ${layoutSpec.widthHint}px, Aspect Ratio ${layoutSpec.ratio} (--ar ${layoutSpec.ratio})`,
      negative_prompt: "low quality, blurry, pixelated, noisy image, cluttered, low contrast"
    },
    layout_media_sosial_global: {
      footer_bawah: contactInfo ? `Info Kontak: ${contactInfo}` : ""
    },
    daftar_slide: [finalSlide]
  };

  generatedPrompt = JSON.stringify(fullCarouselObject);

  let instagramCaption = '';
  let tiktokCaption = '';
  let hashtags = '';

  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        title,
        'Banner Promosi',
        'Pelanggan Umum',
        designStyle,
        true,
        stylePromptText
      );
      instagramCaption = captions.instagramCaption;
      tiktokCaption = captions.tiktokCaption;
      hashtags = captions.hashtags;
    } catch (captionErr) {
      console.warn('Caption generation failed:', captionErr);
    }
  }

  const historyId = uuidv4();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 1, ?, 'Pelanggan Umum', 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        title,
        'Banner Promosi',
        designStyle,
        generatedPrompt,
        layoutSize,
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(',') : null
      ]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId, isBanner: true })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: title,
      contentType: 'Banner Promosi',
      slideCount: 1,
      designStyle,
      targetAudience: 'Pelanggan Umum',
      language: 'ID',
      generatedPrompt,
      imageOrientation: layoutSize,
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(',') : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    });
  } catch (error: any) {
    console.error('Save banner prompt history error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
