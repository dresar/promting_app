import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation, callGroqVisionApiWithRotation } from './groqService';
import { formatSlideOutput, getStylePromptText, getStyleAttributes } from './promptHelpers';

const getLogoLayoutSpec = (layout: string): { ratio: string; widthHint: string; spec: string } => {
  const lower = layout.toLowerCase();
  if (lower.includes('3:4') || lower.includes('portrait')) {
    return {
      ratio: '3:4',
      widthHint: '768x1024',
      spec: 'Portrait (3:4) vertikal — Canvas: 768x1024px, Aspect Ratio: 3:4. Bagus untuk desain logo memanjang ke bawah.',
    };
  } else if (lower.includes('16:9') || lower.includes('landscape') || lower.includes('lanskap')) {
    return {
      ratio: '16:9',
      widthHint: '1024x576',
      spec: 'Landscape (16:9) horizontal — Canvas: 1024x576px, Aspect Ratio: 16:9. Bagus untuk wide logo/wordmark.',
    };
  } else {
    // Default to Square (1:1)
    return {
      ratio: '1:1',
      widthHint: '1024x1024',
      spec: 'Square (1:1) persegi — Canvas: 1024x1024px, Aspect Ratio: 1:1. Sangat ideal untuk format logo standard, ikon aplikasi, dan profil medsos.',
    };
  }
};

const getLogoSlideRoleAndInstruction = (i: number, totalSlides: number, title: string, shape: string, cta?: string): { role: string; instruction: string } => {
  if (totalSlides === 1) {
    return {
      role: 'LOGO UTAMA',
      instruction: `Buat konsep desain logo utama:
[HEADLINE FITUR] (Nama brand "${title}" dan tagline utama jika ada)
[PENJELASAN SINGKAT] (WAJIB KOSONGKAN/jangan diisi, karena slide pertama khusus logo murni dan judul saja tanpa penjelasan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Rancang dan deskripsikan konsep visual logo utama yang kreatif untuk brand "${title}". Sebagai AI Image Generator, kamu wajib menciptakan ide konsep logo yang paling representatif untuk bidang usaha brand ini (apakah berupa minimalis pictorial mark, monogram/lettermark, geometris, atau abstract mark) dengan bentuk dasar "${shape}". Deskripsikan konsep logo tersebut secara visual secara premium, diletakkan di tengah (centered) dengan latar belakang bersih/solid/lembut, dan beri whitespace yang cukup agar logo tampak menonjol dan elegan.`
    };
  }

  // Multi-slide Brand guidelines logic:
  if (i === 1) {
    return {
      role: 'COVER & LOGO UTAMA (Slide 1)',
      instruction: `Buat teks slide cover utama identitas brand:
[HEADLINE FITUR] (Nama brand "${title}" dan tagline utama jika ada)
[PENJELASAN SINGKAT] (WAJIB KOSONGKAN/jangan diisi, karena slide pertama khusus logo murni dan judul saja tanpa penjelasan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Rancang dan deskripsikan konsep visual logo utama yang kreatif untuk brand "${title}". Sebagai AI Image Generator, kamu wajib menciptakan ide konsep logo yang paling representatif untuk bidang usaha brand ini (apakah berupa minimalis pictorial mark, monogram/lettermark, geometris, atau abstract mark) dengan bentuk dasar "${shape}". Deskripsikan konsep logo tersebut secara visual secara premium, diletakkan di tengah (centered) dengan latar belakang bersih/solid/lembut, dan beri whitespace yang cukup agar logo tampak menonjol and elegan.`
    };
  }

  if (i === 2) {
    return {
      role: 'FILOSOFI BENTUK & SIMBOL (Slide 2)',
      instruction: `Buat teks slide filosofi bentuk/simbol logo:
[HEADLINE FITUR] (Filosofi Bentuk Logo "${shape}")
[PENJELASAN SINGKAT] (Jelaskan makna di balik pemilihan bentuk "${shape}" untuk brand "${title}")
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Blueprint desain ikon utama logo dengan garis sketsa (white outline sketch) bergaya arsitektur/blueprint di atas latar biru blueprint atau hitam.`
    };
  }

  if (i === 3) {
    return {
      role: 'FILOSOFI PALET WARNA (Slide 3)',
      instruction: `Buat teks slide filosofi palet warna logo:
[HEADLINE FITUR] (Palet Warna Identitas)
[PENJELASAN SINGKAT] (Sebutkan 3-4 rekomendasi warna dominan beserta kode Hex dan arti psikologisnya)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Swatch palet warna berupa deretan lingkaran berwarna yang disusun secara estetik dan harmonis di atas latar studio bersih.`
    };
  }

  if (i === 4) {
    return {
      role: 'TIPOGRAFI & GAYA HURUF (Slide 4)',
      instruction: `Buat teks slide tipografi brand:
[HEADLINE FITUR] (Tipografi & Karakter Font)
[PENJELASAN SINGKAT] (Rekomendasi jenis font yang melambangkan karakter brand "${title}", misalnya font Sans-Serif modern yang kokoh atau Serif yang elegan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Tampilan anatomi huruf/karakter huruf dari font pilihan secara artistik, dengan garis bantu grid tipografi di atas latar minimalis.`
    };
  }

  if (i === 5) {
    return {
      role: 'VERSI LOGO TRANSPARAN & FLAT (Slide 5)',
      instruction: `Buat teks slide logo versi transparan/monokrom:
[HEADLINE FITUR] (Logo Versi Transparan & Flat)
[PENJELASAN SINGKAT] (Penjelasan aturan penggunaan logo versi satu warna (hitam/putih) tanpa gradasi atau bayangan untuk diletakkan di latar transparan/baju)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Flat vector logo monokrom minimalis (murni warna hitam atau murni warna putih) yang bersih, berujung tajam, diletakkan di atas background solid berwarna abu-abu netral.`
    };
  }

  if (i === 6) {
    return {
      role: 'APLIKASI LOGO PADA KAOS & BAJU (Slide 6)',
      instruction: `Buat teks slide aplikasi kaos/baju:
[HEADLINE FITUR] (Merchandise: Apparel Kaos)
[PENJELASAN SINGKAT] (Panduan penempatan logo pada media pakaian agar terlihat modis dan premium)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup kaos t-shirt katun premium warna hitam minimalis dengan cetakan logo "${title}" yang presisi di bagian dada tengah, dikenakan oleh model estetik dengan pencahayaan studio yang dramatis.`
    };
  }

  if (i === 7) {
    return {
      role: 'APLIKASI LOGO PADA TUMBLER (Slide 7)',
      instruction: `Buat teks slide aplikasi tumbler:
[HEADLINE FITUR] (Merchandise: Tumbler Premium)
[PENJELASAN SINGKAT] (Panduan penempatan logo pada media tumbler logam/stainless steel)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup tumbler stainless steel berwarna matte charcoal/hitam dengan ukiran logo "${title}" berwarna perak/emas yang tergravir indah di tengah botol, diletakkan di atas meja kayu estetik dengan blur background.`
    };
  }

  if (i === 8) {
    return {
      role: 'APLIKASI LOGO PADA SPANDUK & SIGNAGE (Slide 8)',
      instruction: `Buat teks slide aplikasi spanduk/signage:
[HEADLINE FITUR] (Signage Toko & Media Luar)
[PENJELASAN SINGKAT] (Panduan penerapan logo pada spanduk toko, banner jalanan, atau neon box toko fisik)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup papan nama toko (signage) bundar berbahan akrilik hitam dengan logo "${title}" yang bercahaya neon hangat di bagian depan toko modern yang trendi saat sore hari.`
    };
  }

  if (i === 9) {
    return {
      role: 'APLIKASI LOGO PADA STATIONERY (Slide 9)',
      instruction: `Buat teks slide aplikasi stationery:
[HEADLINE FITUR] (Branding Bisnis: Stationery)
[PENJELASAN SINGKAT] (Panduan pencetakan logo pada kartu nama bisnis, amplop, kop surat, dan peralatan kantor)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Mockup tumpukan kartu nama bisnis kertas tebal bertekstur warna putih gading dengan cetakan logo "${title}" berwarna emas embos (embossed gold logo) yang disusun rapi di atas meja marmer.`
    };
  }

  if (i === totalSlides) {
    return {
      role: 'ATURAN BRANDING (DO\'S & DON\'TS) (Slide Akhir)',
      instruction: `Buat teks slide panduan branding dan penutup:
[HEADLINE FITUR] (Aturan Logo (Do's & Don'ts))
[PENJELASAN SINGKAT] (Aturan menjaga proporsi logo, dilarang memutar miring, mendistorsi rasio, atau merusak warna logo)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Call to Action / Info Kontak: ${cta || 'Hubungi tim desain kami untuk kelanjutan panduan branding.'})
[VISUAL PENDUKUNG]: Poster visual minimalis yang menunjukkan panduan larangan mengubah proporsi logo secara visual (misal contoh logo dicoret merah untuk visual yang salah).`
    };
  }

  return {
    role: `IDENTITAS BRAND SLIDE #${i} (Slide ${i})`,
    instruction: `Buat teks slide identitas logo pendukung:
[HEADLINE FITUR] (Topik visual pendukung ke-${i})
[PENJELASAN SINGKAT] (Panduan penggunaan logo/brand "${title}" pada media promosi yang relevan)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Visual mockup logo "${title}" diaplikasikan secara estetik pada produk/media promosi.`
  };
};

export const generateLogoPrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    title,          // Brand name, e.g. "Kopi Kenangan"
    contentType,    // Content Type, e.g. "Logo Desain"
    designStyle,    // e.g. "Minimalis", "Vintage", "Modern"
    description,    // Brand philosophy / details
    layoutSize,     // e.g. "Persegi (Square 1:1)"
    shape,          // e.g. "Lingkaran", "Persegi", "Abstrak"
    slideCount,     // Number of slides, e.g. 10
    sourceImageUrl  // Reference image URLs (comma-separated or array)
  } = req.body;

  if (!title || !description || !designStyle || !shape) {
    return res.status(400).json({ message: 'Missing required parameters. Nama Brand, Filosofi, Gaya, dan Bentuk Logo wajib diisi.' });
  }

  const parsedSlideCount = parseInt(slideCount as string || '10', 10) || 10;
  const layoutSpec = getLogoLayoutSpec(layoutSize || '1:1');

  // Parse reference image URLs
  let imageUrls: string[] = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0);
  } else if (typeof sourceImageUrl === 'string' && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
  }

  // Step 1: Analyze Reference Images (If provided)
  let referenceAnalysis = '';
  if (imageUrls.length > 0) {
    const visionContent: any[] = [
      {
        type: 'text',
        text: `Kamu adalah Senior Brand Identity Specialist & Art Director.
User mengunggah LOGO ASLI mereka sendiri dan memberikan deskripsi brand: "${description}".
Tugas kamu adalah menganalisis gambar logo asli ini secara cerdas dan mendalam:
1. Identifikasi bentuk geometris utama, simbol, ikon, dan struktur layout logo.
2. Identifikasi harmoni warna dan palet warna spesifik yang digunakan beserta kode Hex jika memungkinkan.
3. Berikan interpretasi filosofis dan makna modern yang cerdas dan berkelas dari logo asli ini sesuai dengan deskripsi brand.
Tulis analisis filosofi dan makna desain logo asli ini secara terperinci, modern, dan profesional agar bisa dirumuskan menjadi penjelasan brand guidelines.`
      }
    ];

    for (const url of imageUrls) {
      visionContent.push({
        type: 'image_url',
        image_url: { url }
      });
    }

    const analysisPrompt = [{ role: 'user', content: visionContent }];

    try {
      referenceAnalysis = await callGroqVisionApiWithRotation(analysisPrompt, 'llama-4-scout-17b-16e-instruct');
    } catch (e) {
      console.error('Vision analysis on logo reference failed, using fallback:', e);
      referenceAnalysis = 'Gaya visual bersih minimalis dengan penekanan pada garis tegas (clean line art) dan bentuk logo yang ikonik.';
    }
  }

  // Step 2: Fetch Design Style or Theme prompt from DB
  let stylePromptText = await getStylePromptText(designStyle);

  // Step 3: Loop generation of each slide
  const slideOutputs: any[] = [];
  const previousSlideContentSummaries: string[] = [];
  const previousSlideVisualSummaries: string[] = [];

  for (let i = 1; i <= parsedSlideCount; i++) {
    const { role: slideRole, instruction: contentInstruction } = getLogoSlideRoleAndInstruction(i, parsedSlideCount, title, shape);

    let antiDuplikatKontenSection = '';
    if (previousSlideContentSummaries.length > 0) {
      antiDuplikatKontenSection = `
=== PERINGATAN ANTI-DUPLIKAT KONTEN ===
Slide sebelumnya sudah membahas:
${previousSlideContentSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join('\n')}
DILARANG mengulang poin di atas. Slide ${i} harus membahas aspek baru.`;
    }

    let antiDuplikatVisualSection = '';
    if (previousSlideVisualSummaries.length > 0) {
      antiDuplikatVisualSection = `
=== PERINGATAN ANTI-DUPLIKAT VISUAL ===
Slide sebelumnya sudah menggunakan visual:
${previousSlideVisualSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join('\n')}
DILARANG mengulang visual di atas. Buat deskripsi visual slide ${i} yang unik.`;
    }

    const promptInstruction = `Kamu adalah Senior Brand Identity Designer dan Copywriter profesional.
Buat data untuk SLIDE ${i} dari ${parsedSlideCount} slide Brand Guidelines.
Peran slide: ${slideRole}
Nama Brand: "${title}" | Bentuk Logo: "${shape}" | Gaya Desain/Tema: "${designStyle}"
Filosofi & Deskripsi Umum Brand: "${description}"

=== ATURAN WAJIB DESAIN LOGO & GUIDELINES (HARUS DIPATUHI 100%) ===
1. KEJELASAN & HIERARKI: Pastikan teks headline sangat ringkas (maks 6 kata), dan penjelasan singkat (subtext/detail) mudah dipahami.
2. DETAIL VISUAL: Deskripsikan latar belakang dan komposisi visual utama secara detail untuk AI Image Generator (Midjourney/DALL-E) agar membuat presentasi background yang sesuai tema. ${stylePromptText ? 'Gunakan instruksi gaya latar belakang/tema visual ini: ' + stylePromptText : ''}
3. PENJELASAN LOGO ASLI (MUTLAK): Slide ini BUKAN untuk mendesain logo baru dari nol, melainkan untuk MENJELASKAN filosofi, makna, dan aturan penggunaan LOGO ASLI milik user yang sudah diunggah. Buat narasi penjelasan dan arti logo menjadi modern, cerdas, menarik, dan profesional.
4. DETAIL LOGO USER (PENTING):
   ${imageUrls.length > 0 ? `User telah mengunggah gambar logo aslinya dengan analisis: "${referenceAnalysis}". Sesuaikan penjelasan filosofi teks slide (headline, subtext, detail, microTip) secara cerdas agar selaras dengan visual logo asli tersebut.` : ''}
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}

=== INSTRUKSI KONTEN SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "slideNumber": ${i},
  "totalSlides": ${parsedSlideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul slide/Headline — maks 6 kata]",
    "subtext": "[Penjelasan singkat slide — 1-2 kalimat]",
    "detail": "[Detail teknis / penjelasan filosofi mendalam — 2-3 kalimat]",
    "microTip": "[Tips praktis / info tambahan — 1 kalimat pendek]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi detail visual utama untuk AI Image Generator (Midjourney/DALL-E) agar menggambar visual sesuai tema slide ini. Sertakan detail objek, bentuk '${shape}', warna, pencahayaan studio, dan background yang kontras/bersih. JANGAN ada teks typo di dalam gambar.]",
    "negativePrompt": "[Negative prompt: photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details]"
  }
}`;

    try {
      const slideResult = await callGroqApiWithRotation(promptInstruction);
      let parsed: any = null;
      if (slideResult) {
        const jsonMatch = slideResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (parseErr) {
            console.warn(`Slide ${i} JSON parse error:`, parseErr);
          }
        }
      }

      // Record visual summary & content summary for duplication check
      const visualSummary = parsed?.imagePrompt?.visual ? parsed.imagePrompt.visual.substring(0, 100) : `Visual Slide ${i}`;
      const contentSummary = parsed?.content?.headline ?? `Slide ${i}`;
      previousSlideVisualSummaries.push(visualSummary);
      previousSlideContentSummaries.push(contentSummary);

      const slideOutput = formatSlideOutput({
        slideNumber: parsed?.slideNumber ?? i,
        totalSlides: parsed?.totalSlides ?? parsedSlideCount,
        role: parsed?.role ?? slideRole,
        designStyleName: designStyle,
        orientationSpec: {
          ratio: layoutSpec.ratio,
          widthHint: layoutSpec.widthHint,
          spec: layoutSpec.spec
        },
        stylePromptText,
        visualContent: parsed?.imagePrompt?.visual ?? `Mockup visual logo untuk ${title}`,
        negativePrompt: parsed?.imagePrompt?.negativePrompt ?? 'photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details',
        headline: parsed?.content?.headline ?? title,
        subtext: i === 1 ? '' : (parsed?.content?.subtext ?? ''),
        detail: i === 1 ? '' : (parsed?.content?.detail ?? ''),
        microTip: i === 1 ? '' : (parsed?.content?.microTip ?? ''),
        isPromotional: true,
        targetAudience: 'Pelanggan Umum',
        mandatoryRules: `Ikuti panduan layout logo ${shape} untuk ${title} pada slide ini.`,
        mediaSosialAturan: ''
      });

      slideOutputs.push(slideOutput);
    } catch (slideErr) {
      console.error(`Gagal membuat slide ${i}, fallback...`, slideErr);
      const fallbackOutput = formatSlideOutput({
        slideNumber: i,
        totalSlides: parsedSlideCount,
        role: slideRole,
        designStyleName: designStyle,
        orientationSpec: {
          ratio: layoutSpec.ratio,
          widthHint: layoutSpec.widthHint,
          spec: layoutSpec.spec
        },
        stylePromptText,
        visualContent: `Mockup visual logo untuk ${title} gaya ${designStyle}`,
        negativePrompt: 'photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details',
        headline: title,
        subtext: i === 1 ? '' : `Konsep: ${description}`,
        detail: i === 1 ? '' : `Pengaplikasian logo pada ${slideRole}`,
        microTip: i === 1 ? '' : `Bentuk: ${shape}`,
        isPromotional: true,
        targetAudience: 'Pelanggan Umum',
        mandatoryRules: `Ikuti panduan layout logo ${shape} untuk ${title} pada slide ini.`,
        mediaSosialAturan: ''
      });
      slideOutputs.push(fallbackOutput);
    }
  }

  const styleName = designStyle.split('|')[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);

  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: "Pelanggan Umum",
      jenis_konten: "Pembuatan Logo",
      larangan: "DILARANG KERAS menggunakan foto realistis atau detail 3D jika logo meminta format datar/vektor."
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
      negative_prompt: "photo, realistic, 3d render, shadows, gradients, realistic texture, blurry, noisy, low quality, watermark, complex details"
    },
    layout_media_sosial_global: {
      footer_bawah: `Logo Showcase`
    },
    daftar_slide: slideOutputs
  };

  const generatedPrompt = JSON.stringify(fullCarouselObject);
  const historyId = uuidv4();
  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 'Pelanggan Umum', 'ID', ?, ?, '', '', '', ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        title,
        'Pembuatan Logo',
        parsedSlideCount,
        designStyle,
        generatedPrompt,
        layoutSize || 'Persegi (Square 1:1)',
        imageUrls.length > 0 ? imageUrls.join(',') : null
      ]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId, isLogo: true, slideCount: parsedSlideCount })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: title,
      contentType: 'Pembuatan Logo',
      slideCount: parsedSlideCount,
      designStyle,
      targetAudience: 'Pelanggan Umum',
      language: 'ID',
      generatedPrompt,
      imageOrientation: layoutSize || 'Persegi (Square 1:1)',
      instagramCaption: '',
      tiktokCaption: '',
      hashtags: '',
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(',') : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    });
  } catch (error: any) {
    console.error('Save logo prompt history error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
