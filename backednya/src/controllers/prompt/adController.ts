import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation, callGroqVisionApiWithRotation } from './groqService';
import {
  getOrientationSpec,
  getMandatoryRules,
  getTerminologyGlossary,
  getAudienceInstruction,
  buildPromptFallback,
  generateSocialCaptions,
  formatSlideOutput,
  getStylePromptText,
  getStyleAttributes
} from './promptHelpers';

export const generateAdPrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    title,
    contentType,
    slideCount,
    designStyle,
    targetAudience,
    imageOrientation,
    includeCaption,
    sourceImageUrl,
    description,
    brand,
    price,
    sellingPoints,
    cta,
    characterId,
    useCharacter
  } = req.body;

  if (!description || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({ message: 'Missing required parameters. Deskripsi produk wajib diisi.' });
  }

  const orientationSpec = getOrientationSpec(imageOrientation || 'potret');
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== 'false';

  let characterPromptText = '';
  let characterName = '';
  const shouldAddCharacter = useCharacter === true || useCharacter === 'true';

  if (shouldAddCharacter && characterId) {
    try {
      const charRows = await query('SELECT name, prompt FROM characters WHERE id = ?', [characterId]);
      if (charRows.rows && charRows.rows.length > 0) {
        characterName = charRows.rows[0].name;
        characterPromptText = charRows.rows[0].prompt || '';
      }
    } catch (charErr) {
      console.warn('Failed to fetch character from DB in adController:', charErr);
    }
  }

  // Step 1: Analisis Gambar / Riset Produk
  let imageUrls: string[] = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0);
  } else if (typeof sourceImageUrl === 'string' && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
  }

  let analysisResult = '';
  if (imageUrls.length > 0) {
    const visionContent: any[] = [
      {
        type: 'text',
        text: `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Analisis gambar produk skincare/produk kecantikan/produk fisik lainnya yang diberikan di bawah ini.
User mengunggah ${imageUrls.length} gambar produk untuk referensi analisis Anda. Analisis seluruh produk ini secara detail.
1. Identifikasi produk tersebut: Apa nama mereknya, nama produknya, dan jenis produknya (misal: serum wajah, toner, pembersih wajah).
2. Lakukan riset virtual (simulasi pencarian internet): Sebutkan bahan-bahan utama produk ini, manfaat utama produk ini bagi kulit/pengguna, dan masalah apa saja yang diselesaikannya.
3. Berikan saran promosi: Siapa target audiens ideal untuk produk ini, apa keunggulan unik (Unique Selling Point) yang bisa ditonjolkan dalam iklan?

Jika ada teks atau deskripsi tambahan dari user: "${description || ''}", gabungkan informasi tersebut dalam analisis.
Tulis analisis produk yang rapi, padat, dan informatif.`
      }
    ];

    // Append all images to the vision content array
    for (const url of imageUrls) {
      visionContent.push({
        type: 'image_url',
        image_url: {
          url: url
        }
      });
    }

    const analysisPrompt = [
      {
        role: 'user',
        content: visionContent
      }
    ];

    try {
      analysisResult = await callGroqVisionApiWithRotation(analysisPrompt, 'llama-4-scout-17b-16e-instruct');
    } catch (e) {
      console.error('Gagal analisis gambar via vision model, menggunakan text fallback:', e);
      const textPrompt = `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Riset produk berikut berdasarkan deskripsi: "${description || 'Skincare/Produk Affiliate'}"
1. Sebutkan nama merek/produknya.
2. Jelaskan bahan-bahan utama, manfaat bagi pengguna, dan masalah yang diselesaikan.
3. Berikan saran promosi: target audiens ideal, dan keunggulan unik (Unique Selling Point) yang bisa ditonjolkan.
Tulis analisis produk yang rapi, padat, dan informatif.`;
      try {
        analysisResult = await callGroqApiWithRotation(textPrompt);
      } catch (_) {
        analysisResult = `Produk teridentifikasi berdasarkan input deskripsi user: ${description || 'Produk Iklan Affiliate'}.`;
      }
    }
  } else {
    const textPrompt = `Kamu adalah asisten AI ahli riset produk dan pemasaran affiliate.
Riset produk berikut berdasarkan deskripsi: "${description || 'Skincare/Produk Affiliate'}"
1. Sebutkan nama merek/produknya.
2. Jelaskan bahan-bahan utama, manfaat bagi pengguna, dan masalah yang diselesaikan.
3. Berikan saran promosi: target audiens ideal, dan keunggulan unik (Unique Selling Point) yang bisa ditonjolkan.
Tulis analisis produk yang rapi, padat, dan informatif.`;
    try {
      analysisResult = await callGroqApiWithRotation(textPrompt);
    } catch (_) {
      analysisResult = `Produk teridentifikasi berdasarkan input deskripsi user: ${description || 'Produk Iklan Affiliate'}.`;
    }
  }

  // Gabungkan dengan field opsional untuk analisis final copywriter
  let contextKreatif = `\nHasil Riset/Analisis Produk: ${analysisResult}\n`;
  if (brand) contextKreatif += `Merek Produk: ${brand}\n`;
  if (price) contextKreatif += `Harga Promo: ${price}\n`;
  if (sellingPoints) contextKreatif += `Keunggulan Utama (USP): ${sellingPoints}\n`;
  if (cta) contextKreatif += `Kustom Call to Action (CTA): ${cta}\n`;

  let aiTitle = title || '';
  if (!aiTitle) {
    try {
      const titlePrompt = `Kamu adalah Copywriter profesional. Buatlah judul iklan ringkas (maks 5 kata) yang merangkum deskripsi produk: "${description.substring(0, 100)}". LANGSUNG berikan hasil judulnya saja, tanpa tanda kutip, tanpa awalan/akhiran.`;
      const summarizedTitle = await callGroqApiWithRotation(titlePrompt);
      if (summarizedTitle && summarizedTitle.trim().length > 0) {
        aiTitle = summarizedTitle.trim().replace(/^"|"$/g, '').trim();
      }
    } catch (e) {
      aiTitle = brand || 'Produk Affiliate';
    }
  }

  let generatedPrompt = '';
  let stylePromptText = '';
  const isPromotional = true;

  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);
  const audienceInstruction = getAudienceInstruction(targetAudience);

  try {
    // Ambil style atau theme prompt dari DB
    stylePromptText = await getStylePromptText(designStyle);

    // Bangun visual concept
    const setupInstruction = `Kamu adalah Senior Graphic Designer dan Copywriter profesional yang sangat ahli dalam kombinasi warna, estetika visual, tata letak, dan desain promosi media sosial.
Topik Iklan: "${aiTitle}" | Merek: ${brand || '-'} | Audiens: ${targetAudience}
Gaya Desain: ${designStyle}
Orientasi: ${orientationSpec.spec}

Context Produk: ${contextKreatif}

${mandatoryRules}

Tugas: Buatlah SATU paragraf pendek "Konsep Objek Latar" yang menggambarkan elemen/objek apa saja yang sebaiknya ada di latar belakang gambar promosi produk ini agar terkesan premium, mewah, dan konsisten di semua slide.
INGAT: JANGAN tentukan gaya desain atau warna (karena sudah kami tentukan sendiri). Fokus HANYA pada objek visual atau layout pendukung yang konsisten di semua slide.
Berikan HANYA paragraf konsep objek visualnya, tanpa teks lain.`;

    let mainVisualConcept = '';
    try {
      mainVisualConcept = await callGroqApiWithRotation(setupInstruction);
    } catch (e) {
      mainVisualConcept = `Latar produk premium, bersih, minimalis modern, berkelas.${stylePromptText ? ' ' + stylePromptText : ''}`;
    }

    const finalPromptParts: string[] = [];
    const previousSlideContentSummaries: string[] = [];
    const previousSlideVisualSummaries: string[] = [];

    for (let i = 1; i <= slideCount; i++) {
      let slideRole = '';
      let contentInstruction = '';

      if (i === 1) {
        slideRole = 'HOOK UTAMA & COVER PRODUK (Slide 1)';
        contentInstruction = `Buat teks slide jualan penarik perhatian (Slide 1):
[HEADLINE FITUR] (1 kalimat pendek, bold, maks 8 kata, penarik perhatian utama yang sangat menggoda tentang manfaat produk/solusi instan. Jangan sebut kata "Cover".)
[PENJELASAN SINGKAT] (1 kalimat pendek pendukung rasa ingin tahu pembaca tentang produk ini)
[BUKTI/KLAIM] (Abaikan atau kosongkan)
[DETAIL TAMBAHAN] (Abaikan atau kosongkan)
[VISUAL PENDUKUNG]: Deskripsikan visual slide cover utama: Tampilkan produk secara elegan di tengah dengan backdrop mewah.`;
      } else if (i === slideCount) {
        slideRole = 'CALL TO ACTION & PENUTUP PROMOSI (Slide Akhir)';
        contentInstruction = `Buat teks slide penutup iklan/pembelian (Slide Akhir):
[HEADLINE FITUR] (1 kalimat tegas ajakan bertindak/CTA, maks 8 kata, misal: "Dapatkan Sekarang!" atau "Jangan Sampai Kehabisan!")
[PENJELASAN SINGKAT] (1 kalimat instruksi pembelian: ${cta || 'Klik link di bio atau DM untuk order'})
[BUKTI/KLAIM] (Garansi kepuasan atau jaminan keaslian produk)
[DETAIL TAMBAHAN] (Harga promo jika ada: ${price || 'Harga spesial terbatas!'})
[VISUAL PENDUKUNG]: Deskripsikan visual penutup: ilustrasi kemudahan transaksi atau tombol CTA kontras.`;
      } else {
        slideRole = `MANFAAT/KEUNGGULAN PRODUK #${i - 1} (Slide ${i})`;
        contentInstruction = `Buat teks slide isi fitur/manfaat produk yang persuasif:
[HEADLINE FITUR] (1 kalimat bold tentang keunggulan/manfaat spesifik produk, maks 8 kata)
[PENJELASAN SINGKAT] (2-3 kalimat penjelasan mengapa manfaat ini penting berdasarkan analisis produk atau bahan aktif, maks 40 kata total)
[BUKTI/KLAIM] (2 kalimat berisi klaim nyata, manfaat, atau review dari riset, maks 30 kata)
[DETAIL TAMBAHAN] (1-2 kalimat detail ekstra, info harga jika relevan, atau spesifikasi, maks 25 kata)
[VISUAL PENDUKUNG]: Deskripsikan elemen visual / produk / scene pendukung yang relevan dengan manfaat ini (bukan gaya desain, tapi ISI gambarnya — misal: botol skincare di atas batu marmer, dll)`;
      }

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

      let characterInstruction = '';
      if (shouldAddCharacter && characterPromptText) {
        characterInstruction = `
=== ATURAN KARAKTER (WAJIB KONSISTEN) ===
Kamu WAJIB menyertakan karakter berikut di dalam deskripsi visual slide ${i} ini:
- Nama Karakter: "${characterName}"
- Deskripsi Visual Karakter (Wajib ditulis di setiap visual slide agar konsisten): "${characterPromptText}"
- Posisi & Gerakan: Silakan tentukan pose/gerakan karakter yang bervariasi di slide ${i} ini secara logis (misal: memegang produk, menunjuk ke produk, tersenyum menyapa konsumen, dsb).
- Konsistensi: Pastikan warna baju, gaya rambut, aksesoris, dan ciri fisik karakter konsisten dengan slide lainnya.`;
      } else {
        characterInstruction = `
=== ATURAN KARAKTER (DILARANG ADA KARAKTER) ===
- DILARANG keras menyertakan karakter manusia, maskot, avatar, atau orang di dalam deskripsi visual slide ${i} ini.
- Visual harus murni produk, background dekoratif, atau elemen grafis/ilustrasi benda mati yang relevan dengan promosi.`;
      }

      const promptInstruction = `Kamu adalah Senior Graphic Designer dan Copywriter profesional.
Buat data untuk SLIDE ${i} dari ${slideCount} slide iklan.
Peran slide: ${slideRole}
Topik Iklan: "${aiTitle}" | Merek: ${brand || '-'} | Harga: ${price || '-'} | Audiens: ${targetAudience}

${mandatoryRules}
${terminology}
${audienceInstruction}

Orientasi wajib: ${orientationSpec.spec}
Gaya Desain: ${designStyle}

Konsep Objek Latar (konsisten):
"${mainVisualConcept}"
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}
${characterInstruction}

=== INSTRUKSI KONTEN PROMOSI SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kamu WAJIB mengembalikan output dalam format JSON murni. JANGAN ada teks, penjelasan, atau markdown apapun di luar JSON. Mulai langsung dengan { dan akhiri dengan }.

Gunakan format JSON PERSIS seperti ini:
{
  "slideNumber": ${i},
  "totalSlides": ${slideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul poin — maks 8 kata]",
    "subtext": "[Pembuka penjelasan — 1-2 kalimat santai]",
    "detail": "[Penjelasan utama lengkap — 3-5 kalimat persuasif]",
    "microTip": "[Tips praktis/insight singkat]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi detail visual slide ini]",
    "visualSummary": "[Ringkasan visual 1 kalimat]",
    "contentSummary": "[Ringkasan konten 1 kalimat]",
    "negativePrompt": "[Negative prompt standard]"
  }
}`;

      const mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, tampilkan teks nomor halaman/slide: "${i}/${slideCount}".
- Di pojok kanan atas gambar, tampilkan teks ajakan follow: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan nama merek "${brand || 'Affiliate'}" & info produk.`;

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

        const slideOutput = formatSlideOutput({
          slideNumber: parsed?.slideNumber ?? i,
          totalSlides: parsed?.totalSlides ?? slideCount,
          role: parsed?.role ?? slideRole,
          designStyleName: designStyle,
          orientationSpec,
          stylePromptText,
          visualContent: parsed?.imagePrompt?.visual ?? (slideResult ? slideResult.trim().substring(0, 300) : `Visual pendukung Slide ${i} untuk ${aiTitle}`),
          negativePrompt: parsed?.imagePrompt?.negativePrompt ?? 'low quality, blurry, pixelated, noisy image, cluttered, low contrast',
          headline: parsed?.content?.headline ?? (i === 1 ? aiTitle : `Slide ${i}: Poin penting`),
          subtext: parsed?.content?.subtext ?? '',
          detail: parsed?.content?.detail ?? '',
          microTip: parsed?.content?.microTip ?? '',
          isPromotional,
          targetAudience,
          mandatoryRules,
          mediaSosialAturan
        });

        const contentSummary = parsed?.imagePrompt?.contentSummary || slideOutput.teks_dalam_gambar.headline.substring(0, 100);
        const visualSummary = parsed?.imagePrompt?.visualSummary || slideOutput.deskripsi_visual.objek_dan_konteks.substring(0, 120);

        previousSlideContentSummaries.push(contentSummary);
        previousSlideVisualSummaries.push(visualSummary);

        finalPromptParts.push(JSON.stringify(slideOutput));
      } catch (e) {
        console.error(`Slide ${i} generation failed, using fallback:`, e);
        const errorSlide = formatSlideOutput({
          slideNumber: i,
          totalSlides: slideCount,
          role: slideRole,
          designStyleName: designStyle,
          orientationSpec,
          stylePromptText,
          visualContent: `Visual pendukung Slide ${i} untuk ${aiTitle}`,
          negativePrompt: 'low quality, blurry, pixelated, noisy image, cluttered, low contrast',
          headline: i === 1 ? aiTitle : `Slide ${i}: Poin penting`,
          subtext: '',
          detail: '',
          microTip: '',
          isPromotional,
          targetAudience,
          mandatoryRules,
          mediaSosialAturan
        });
        
        previousSlideContentSummaries.push(`Slide ${i}: ${slideRole}`);
        previousSlideVisualSummaries.push(`${slideRole} visual`);

        finalPromptParts.push(JSON.stringify(errorSlide));
      }
    }

    const styleName = designStyle.split('|')[0].trim();
    const styleAttributes = getStyleAttributes(styleName, stylePromptText);

    const fullCarouselObject = {
      aturan_global: {
        platform_target: "Instagram Carousel Post",
        peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
        target_audiens: targetAudience,
        jenis_konten: contentType || "Iklan Produk",
        larangan: "DILARANG KERAS memodifikasi produk asli atau mengubah warna brand."
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
        dimensi_canvas: `Canvas ${orientationSpec.widthHint}px, Aspect Ratio ${orientationSpec.ratio} (--ar ${orientationSpec.ratio})`,
        negative_prompt: "low quality, blurry, pixelated, noisy, cluttered, low contrast, text errors, watermark"
      },
      layout_media_sosial_global: {
        footer_bawah: `Instagram & TikTok Watermark`
      },
      daftar_slide: finalPromptParts.map(p => {
        try {
          return JSON.parse(p);
        } catch (_) {
          return p;
        }
      })
    };

    generatedPrompt = JSON.stringify(fullCarouselObject);
  } catch (err) {
    console.error('Ad prompt generation error:', err);
    generatedPrompt = buildPromptFallback(aiTitle, contentType || 'Iklan Produk', slideCount, designStyle, targetAudience);
  }

  let instagramCaption = '';
  let tiktokCaption = '';
  let hashtags = '';

  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        aiTitle,
        contentType || 'Iklan Produk',
        targetAudience,
        designStyle,
        isPromotional,
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
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        aiTitle,
        contentType || 'Iklan Produk',
        slideCount,
        designStyle,
        targetAudience,
        generatedPrompt,
        imageOrientation || 'Persegi (Square 1:1)',
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(',') : null
      ]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId, isAd: true })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType: contentType || 'Iklan Produk',
      slideCount,
      designStyle,
      targetAudience,
      language: 'ID',
      generatedPrompt,
      imageOrientation: imageOrientation || 'Persegi (Square 1:1)',
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
    console.error('Save ad prompt history error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
