import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation, callGroqVisionApiWithRotation } from './groqService';
import {
  getMandatoryRules,
  getTerminologyGlossary,
  getAudienceInstruction,
  formatSlideOutput,
  generateSocialCaptions,
  getStylePromptText,
  getStyleAttributes
} from './promptHelpers';

// Orientasi produk digital selalu 1:1 square
const DIGITAL_PRODUCT_ORIENTATION = {
  ratio: '1:1',
  widthHint: '1080x1080',
  spec: 'Persegi (1:1) — Canvas: 1080x1080px. Teks area: tengah & atas canvas. Safe Area: 80px dari semua sisi.',
};

// Info sosmed permanen untuk produk digital
const DIGITAL_SOSMED_INFO = {
  website: 'www.inka.my.id',
  tiktok: '@digitalinka.id2027',
  instagram: '@arif_ex21',
};

const DIGITAL_PRODUCT_SYSTEM_PROTOCOL = `=== SYSTEM EXECUTION PROTOCOL — WAJIB DIPATUHI 100% ===

Kamu adalah Senior AI Image Generator, Senior Art Director, dan Senior Editorial Graphic Designer yang bertugas menghasilkan desain visual premium berkualitas komersial.

Sebelum mulai membuat gambar, WAJIB lakukan proses berikut secara internal tanpa menampilkannya kepada user.

━━━━━━━━━━━━━━━━━━
STEP 1 — ANALISIS PROMPT
━━━━━━━━━━━━━━━━━━

Pelajari seluruh isi prompt ini secara menyeluruh, termasuk namun tidak terbatas pada:

• role
• peran
• slideNumber
• totalSlides
• deskripsi_visual
• gaya_dominan
• teks_dalam_gambar
• aturan_permanen
• media_sosial_aturan
• negative_prompt
• seluruh instruksi lainnya

Pastikan seluruh elemen saling konsisten sebelum mulai mendesain.

━━━━━━━━━━━━━━━━━━
STEP 2 — PAHAMI IDENTITAS CAROUSEL
━━━━━━━━━━━━━━━━━━

Anggap seluruh slide berasal dari SATU PROJECT yang sama.

Seluruh slide HARUS memiliki identitas visual yang konsisten, meliputi:

• style
• typography
• visual language
• branding
• spacing
• hierarchy
• tone
• layout system
• warna utama
• desain footer
• desain nomor slide
• CTA
• ilustrasi

Namun setiap slide WAJIB memiliki komposisi visual yang unik.

━━━━━━━━━━━━━━━━━━
STEP 3 — CEGAH DUPLIKASI
━━━━━━━━━━━━━━━━━━

Sebelum membuat komposisi baru, lakukan evaluasi internal terhadap kemungkinan kemiripan dengan slide lain dalam carousel.

Jika ditemukan kemiripan tinggi pada salah satu aspek berikut:

• angle kamera
• framing
• pose karakter
• posisi objek utama
• urutan visual
• komposisi layout
• proporsi ruang kosong
• bentuk abstrak
• distribusi warna
• ukuran objek
• peletakan ikon
• peletakan headline
• peletakan CTA

maka WAJIB membuat variasi baru.

Variasi harus tetap mempertahankan identitas visual carousel tetapi memberikan pengalaman visual yang benar-benar berbeda.

━━━━━━━━━━━━━━━━━━
STEP 4 — PRIORITAS DESAIN
━━━━━━━━━━━━━━━━━━

Selalu prioritaskan:

1. Hierarki visual yang jelas.
2. Komposisi premium.
3. Keseimbangan visual.
4. Keterbacaan teks.
5. Fokus terhadap pesan utama slide.
6. Konsistensi branding.
7. Kesan eksklusif.
8. Kesan profesional.
9. Kesan modern.
10. Mudah dipahami dalam waktu kurang dari 3 detik.

━━━━━━━━━━━━━━━━━━
STEP 5 — KUALITAS DESAIN
━━━━━━━━━━━━━━━━━━

Hasil akhir HARUS terlihat seperti karya desainer profesional, BUKAN template AI biasa.

Hindari:

• layout generik
• objek mengambang tanpa tujuan
• penempatan ikon acak
• teks bertumpuk
• komposisi kosong
• elemen yang tidak memiliki fungsi visual
• proporsi tidak seimbang
• visual membosankan
• komposisi monoton

━━━━━━━━━━━━━━━━━━
STEP 6 — EKSEKUSI
━━━━━━━━━━━━━━━━━━

Gunakan seluruh instruksi pada slide ini sebagai sumber utama.

JANGAN mengurangi kualitas hanya karena keterbatasan ruang.

Optimalkan komposisi secara profesional agar seluruh elemen tetap nyaman dibaca.

Jika terdapat konflik instruksi, prioritaskan:

1. instruksi_awal_wajib
2. aturan_permanen
3. deskripsi_visual
4. teks_dalam_gambar
5. media_sosial_aturan
6. negative_prompt

━━━━━━━━━━━━━━━━━━
HASIL AKHIR
━━━━━━━━━━━━━━━━━━

Hasil akhir harus memenuhi seluruh kriteria berikut:

✓ Premium
✓ Modern
✓ Bersih
✓ High-end
✓ Konsisten
✓ Tidak duplikat
✓ Siap dipublikasikan
✓ Layak dijadikan materi promosi profesional
✓ Memiliki identitas visual yang kuat
✓ Mudah dipahami dalam sekali lihat

=== END SYSTEM EXECUTION PROTOCOL ===`;

/**
 * Membangun instruksi layout sosmed permanen untuk produk digital.
 * Dipasang di footer setiap slide.
 */
const buildDigitalSosmedAturan = (slideNumber: number, slideCount: number): string => {
  return `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional dan permanen di setiap slide:
- Di pojok kiri atas gambar, tampilkan nomor slide: "${slideNumber}/${slideCount}" dalam kotak kecil berwarna gelap transparan.
- Di pojok kanan atas gambar, tampilkan teks ajakan kecil: "Swipe →" atau "Geser →".
- Di bagian FOOTER BAWAH gambar, tampilkan info sosial media dengan layout horizontal premium:
  * LOGO TIKTOK (ikon TikTok asli, monochrome putih) diikuti teks: "${DIGITAL_SOSMED_INFO.tiktok}"
  * LOGO INSTAGRAM (ikon Instagram gradient/putih) diikuti teks: "${DIGITAL_SOSMED_INFO.instagram}" + badge kecil bertuliskan "FOLLOW" (berwarna kontras, seperti tombol)
  * IKON GLOBE/WEB diikuti teks: "${DIGITAL_SOSMED_INFO.website}"
- Footer ini menggunakan background strip semi-transparan gelap agar tetap terbaca di atas background apapun.
- PENTING: Footer sosmed ini WAJIB tampil di setiap slide tanpa kecuali.`;
};

export const generateDigitalProductPrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const {
    title,
    slideCount,
    designStyle,
    targetAudience,
    includeCaption,
    sourceImageUrl,
    description,
    brand,
    price,
    productType,
    additionalPrompt,
    characterId,
    useCharacter,
    contentType,
    color1,
    color2
  } = req.body;

  if (!description || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({
      message: 'Missing required parameters. Deskripsi produk digital, jumlah slide, gaya desain, dan target audiens wajib diisi.'
    });
  }

  // Validasi slide count 2-5
  const validatedSlideCount = Math.max(2, Math.min(5, parseInt(slideCount, 10) || 3));
  const orientationSpec = DIGITAL_PRODUCT_ORIENTATION;
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== 'false';

  // Fetch character data jika dipilih
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
      console.warn('Failed to fetch character from DB in digitalProductController:', charErr);
    }
  }

  // Parse image URLs
  let imageUrls: string[] = [];
  if (Array.isArray(sourceImageUrl)) {
    imageUrls = sourceImageUrl.filter((url: any) => url && typeof url === 'string' && url.trim().length > 0);
  } else if (typeof sourceImageUrl === 'string' && sourceImageUrl.trim().length > 0) {
    imageUrls = sourceImageUrl.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
  }

  // ─── Step 1: Analisis Produk Digital ────────────────────────────────────────
  let analysisResult = '';
  const digitalAnalysisPrompt = `Kamu adalah pakar pemasaran produk digital dan konten kreator Indonesia yang berpengalaman.
Analisis produk digital berikut secara mendalam untuk keperluan pembuatan konten promosi media sosial (Instagram/TikTok).

Produk Digital: "${description || 'Produk Digital'}"
${brand ? `Brand/Nama Penjual: ${brand}` : ''}
${price ? `Harga: ${price}` : ''}
${productType ? `Jenis Produk Digital: ${productType}` : ''}
${additionalPrompt ? `Informasi Tambahan dari Pemilik: "${additionalPrompt}"` : ''}

Berikan analisis yang mencakup:
1. Jenis & kategori produk digital ini (ebook, course, template, preset, tools, dll)
2. Target pembeli ideal dan pain point yang diselesaikan
3. Manfaat utama & keunggulan kompetitif (Unique Selling Point)
4. Fitur atau konten apa saja yang kemungkinan ada di dalamnya
5. Saran harga & positioning (jika tidak ada harga, sarankan range harga wajar)
6. Hook/angle marketing yang paling efektif untuk media sosial Indonesia

Tulis analisis yang terstruktur, padat, dan langsung ke poin.`;

  if (imageUrls.length > 0) {
    const visionContent: any[] = [
      {
        type: 'text',
        text: `Kamu adalah pakar pemasaran produk digital Indonesia.
Analisis gambar produk digital yang diupload user. User mengirim ${imageUrls.length} gambar.
Identifikasi:
1. Jenis produk digital apa ini (ebook, template, course, preset, tools, software, dll)?
2. Tampilan/preview produknya seperti apa (mockup di laptop/HP, cover buku digital, screenshot dashboard, dll)?
3. Keunggulan visual yang bisa ditonjolkan dalam promosi?
4. Saran copywriting untuk social media Indonesia?

Deskripsi tambahan dari pemilik: "${description || ''}"
${brand ? `Brand: ${brand}` : ''}
${price ? `Harga: ${price}` : ''}
${additionalPrompt ? `Info tambahan: "${additionalPrompt}"` : ''}

Tulis analisis yang padat dan informatif.`
      }
    ];

    for (const url of imageUrls) {
      visionContent.push({ type: 'image_url', image_url: { url } });
    }

    try {
      analysisResult = await callGroqVisionApiWithRotation(
        [{ role: 'user', content: visionContent }],
        'llama-4-scout-17b-16e-instruct'
      );
    } catch (e) {
      console.warn('Vision analysis failed, using text fallback:', e);
      try {
        analysisResult = await callGroqApiWithRotation(digitalAnalysisPrompt);
      } catch (_) {
        analysisResult = `Produk digital teridentifikasi: ${description || 'Produk Digital'}. ${brand ? `Brand: ${brand}.` : ''}`;
      }
    }
  } else {
    try {
      analysisResult = await callGroqApiWithRotation(digitalAnalysisPrompt);
    } catch (_) {
      analysisResult = `Produk digital teridentifikasi: ${description || 'Produk Digital'}. ${brand ? `Brand: ${brand}.` : ''}`;
    }
  }

  // ─── Step 2: Generate AI Title ────────────────────────────────────────────────
  let aiTitle = title || '';
  if (!aiTitle) {
    try {
      const titlePrompt = `Kamu adalah Copywriter ahli produk digital Indonesia. Buat judul konten promosi yang menarik (maks 5 kata) untuk produk digital: "${description.substring(0, 120)}". LANGSUNG berikan judul tanpa tanda kutip, tanpa awalan/akhiran.`;
      const generated = await callGroqApiWithRotation(titlePrompt);
      if (generated && generated.trim().length > 0) {
        aiTitle = generated.trim().replace(/^"|"$/g, '').trim();
      }
    } catch (_) {
      aiTitle = brand || 'Produk Digital';
    }
  }

  // ─── Step 3: Konsep Visual Global ────────────────────────────────────────────
  const stylePromptText = await getStylePromptText(designStyle);

  const contextProduk = `
Analisis Produk Digital: ${analysisResult}
${brand ? `Brand/Penjual: ${brand}` : ''}
${price ? `Harga: ${price}` : ''}
${productType ? `Jenis: ${productType}` : ''}
${additionalPrompt ? `Prompt Tambahan dari User: "${additionalPrompt}"` : ''}`;

  const isPromotional = true;
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);
  const audienceInstruction = getAudienceInstruction(targetAudience);

  // Buat konsep visual global yang konsisten
  const visualConceptPrompt = `Kamu adalah Senior Art Director spesialis produk digital dan e-commerce Indonesia.
Produk Digital: "${aiTitle}" | Brand: ${brand || '-'} | Audiens: ${targetAudience}
Gaya Desain: ${designStyle}
${color1 && color2 ? `Paduan Warna Konten Wajib: ${color1} dan ${color2}` : ''}

Context Produk: ${contextProduk}

${mandatoryRules}

Tugas: Buat SATU paragraf "Konsep Visual Latar" untuk semua slide produk digital ini.
Fokus pada: elemen visual digital (mockup laptop/HP, dashboard app, ebook cover, template preview, dll), latar yang modern dan bersih.
${color1 && color2 ? `PENTING: Gunakan paduan kombinasi warna ${color1} dan ${color2} sebagai warna dasar visual utama.` : 'JANGAN tentukan gaya warna/tipografi — fokus pada OBJEK visual dan komposisi.'}
Berikan HANYA paragraf konsepnya, tanpa teks lain.`;

  let mainVisualConcept = '';
  try {
    mainVisualConcept = await callGroqApiWithRotation(visualConceptPrompt);
  } catch (_) {
    mainVisualConcept = `Mockup produk digital premium (laptop/smartphone screen), latar bersih modern, elemen grafis digital minimalis, nuansa warna brand yang konsisten.`;
  }

  // ─── Step 4: Generate Slides ─────────────────────────────────────────────────
  const finalPromptParts: string[] = [];
  const previousSlideContentSummaries: string[] = [];
  const previousSlideVisualSummaries: string[] = [];

  for (let i = 1; i <= validatedSlideCount; i++) {
    let slideRole = '';
    let contentInstruction = '';

    // ── Cover Eksklusif (Slide 1) ──────────────────────────────────────────
    if (i === 1) {
      slideRole = 'COVER EKSKLUSIF PRODUK DIGITAL (Slide 1)';
      contentInstruction = `SLIDE COVER EKSKLUSIF — Buat visual cover yang memukau dan premium untuk produk digital ini:
[HEADLINE] (nama/judul produk digital yang kuat, maks 6 kata, BESAR dan dominan di tengah)
[SUBTEXT] (tagline singkat produk, maks 8 kata, premium dan menggoda)
[DETAIL] (benefit utama atau kategori produk, sangat singkat)
[MICRO TIP] (kosongkan atau badge kecil seperti "NEW RELEASE" / "BEST SELLER")

[VISUAL COVER EKSKLUSIF]: 
Deskripsikan visual cover yang memukau:
- Mockup produk digital yang realistis dan premium (laptop terbuka dengan dashboard/ebook di layar, HP menampilkan interface app, atau preview cover ebook floating 3D)
- Background menggunakan gradient premium (sesuai gaya desain) atau dark premium
- Elemen dekoratif digital: partikel cahaya, garis circuit halus, atau shape geometris futuristik
- Typography area yang jelas: judul besar di tengah/atas, tagline di bawahnya
- Tampilkan preview/thumbnail produk secara visual yang nyata dan menarik
- Kesan PREMIUM, PROFESIONAL, dan EKSKLUSIF — seperti landing page brand ternama
- Sudut kamera: isometric atau 3/4 view untuk mockup produk digital`;

    // ── CTA & Harga (Slide Akhir) ──────────────────────────────────────────
    } else if (i === validatedSlideCount) {
      slideRole = `INFO PEMBELIAN & CTA (Slide ${i} — Penutup)`;
      contentInstruction = `Buat slide penutup berisi info cara beli & CTA produk digital:
[HEADLINE] (ajakan bertindak tegas, maks 8 kata, seperti "Dapatkan Akses Sekarang!" atau "Raih Hasilnya Mulai Hari Ini!")
[SUBTEXT] (info harga + cara beli: ${price ? `Harga: ${price}` : 'Harga spesial tersedia'}. ${brand ? `Hub: ${brand}` : 'DM/komentar untuk info pembelian'})
[DETAIL] (apa yang didapat setelah beli: akses, bonus, lifetime, dll — berdasarkan analisis produk)
[MICRO TIP] (garansi, jaminan, atau keunggulan: "Garansi Puas atau Uang Kembali" / "Akses Seumur Hidup")

[VISUAL PENDUKUNG]: Visual penutup yang persuasif — tombol CTA besar kontras, countdown timer visual (jika relevan), mockup produk + tangan sedang mengakses, elemen "sebelum & sesudah" ringan, atau visual hasil yang bisa dicapai setelah menggunakan produk.`;

    // ── Slide Info Produk (Slide 2 hingga N-1) ─────────────────────────────
    } else {
      const infoIndex = i - 1;
      const infoTopics = [
        'ISI & KONTEN PRODUK — Apa saja yang didapat pembeli',
        'MANFAAT UTAMA & HASIL NYATA — Transformasi setelah menggunakan produk',
        'KEUNGGULAN & DIFERENSIASI — Kenapa pilih produk ini dibanding yang lain',
      ];
      const topicHint = infoTopics[(infoIndex - 1) % infoTopics.length];

      slideRole = `INFO PRODUK DIGITAL #${infoIndex} — ${topicHint} (Slide ${i})`;
      contentInstruction = `Buat slide informasi produk digital yang menarik dan informatif — TOPIK: ${topicHint}:
[HEADLINE] (poin utama dari topik ini, maks 8 kata, bold dan eye-catching)
[SUBTEXT] (pembuka 1-2 kalimat, santai, asik, bikin penasaran)
[DETAIL] (3-5 poin konkret atau kalimat persuasif tentang topik ini, berdasarkan analisis produk — maks 50 kata)
[MICRO TIP] (fakta menarik, angka, atau testimoni singkat yang memperkuat slide ini)

[VISUAL PENDUKUNG]: Deskripsikan visual yang relevan dengan topik — bisa berupa: preview konten/materi di dalam produk (screenshot mockup), infografis ringkas manfaat, before/after visual, icon-based layout, atau ilustrasi yang mewakili manfaat produk ini secara visual.`;
    }

    // Anti-duplikat
    let antiDuplikatKontenSection = '';
    if (previousSlideContentSummaries.length > 0) {
      antiDuplikatKontenSection = `
=== ANTI-DUPLIKAT KONTEN ===
Slide sebelumnya sudah membahas:
${previousSlideContentSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join('\n')}
Slide ${i} WAJIB membahas aspek yang berbeda dan baru.`;
    }

    let antiDuplikatVisualSection = '';
    if (previousSlideVisualSummaries.length > 0) {
      antiDuplikatVisualSection = `
=== ANTI-DUPLIKAT VISUAL ===
Visual slide sebelumnya:
${previousSlideVisualSummaries.map((s, idx) => `  - Slide ${idx + 1}: ${s}`).join('\n')}
Buat deskripsi visual slide ${i} yang UNIK dan berbeda.`;
    }

    // Instruksi karakter
    let characterInstruction = '';
    if (shouldAddCharacter && characterPromptText) {
      characterInstruction = `
=== ATURAN KARAKTER (WAJIB KONSISTEN & BERVARIASI) ===
Sertakan karakter berikut di visual slide ${i}:
- Nama: "${characterName}"
- Deskripsi Visual: "${characterPromptText}"
- KONSISTENSI VISUAL MUTLAK: Karakter harus memiliki penampilan yang konsisten di semua slide: warna baju/pakaian, gaya rambut, warna rambut, warna kulit, ekspresi dasar, dan aksesoris harus 100% konsisten. Pakaian karakter wajib menggunakan kombinasi warna ${color1 || 'brand'} dan ${color2 || 'brand'}.
- VARIASI PELETAKAN & POSE: Posisi (peletakan) dan pose karakter HARUS berbeda-beda/bervariasi di setiap slide agar tidak membosankan atau terlihat seperti duplikat. (Contoh: jika slide 1 di kanan menunjuk ke kiri, slide 2 di kiri sedang memegang laptop, slide 3 close-up ekspresi/sedang mengetik, dst.).
- PENTING: Jangan menaruh karakter di posisi atau pose yang sama di dua slide berbeda.`;
    } else {
      characterInstruction = `
=== ATURAN KARAKTER: TIDAK ADA KARAKTER ===
DILARANG menampilkan karakter manusia, avatar, atau maskot.
Visual hanya boleh berisi produk digital, mockup, elemen grafis, atau ilustrasi benda.`;
    }

    // Prompt utama per slide
    const promptInstruction = `Kamu adalah Senior Graphic Designer & Digital Marketing Specialist spesialis produk digital Indonesia.
Buat data untuk SLIDE ${i} dari ${validatedSlideCount} slide konten promosi produk digital.

Peran Slide: ${slideRole}
Produk: "${aiTitle}" | Brand: ${brand || '-'} | Harga: ${price || 'Harga spesial'} | Audiens: ${targetAudience}

${mandatoryRules}
${terminology}
${audienceInstruction}

Orientasi: ${orientationSpec.spec}
Gaya Desain: ${designStyle}
${stylePromptText ? `Style Guide: "${stylePromptText}"` : ''}
${color1 && color2 ? `ATURAN WARNA MUTLAK: Gunakan HANYA paduan 2 warna utama yaitu ${color1} dan ${color2}. Jangan campur warna lain di luar paduan ini untuk elemen utama/latar belakang/grafis/teks, demi hasil paduan yang sempurna.` : ''}

Context Produk Digital:
${contextProduk}

Konsep Visual Global (konsisten di semua slide):
"${mainVisualConcept}"
${antiDuplikatKontenSection}
${antiDuplikatVisualSection}
${characterInstruction}

=== INSTRUKSI KONTEN SLIDE ${i} ===
${contentInstruction}

=== FORMAT OUTPUT WAJIB: JSON ===
Kembalikan HANYA JSON murni, tanpa teks apapun di luar JSON. Mulai dengan { dan akhiri dengan }.

{
  "slideNumber": ${i},
  "totalSlides": ${validatedSlideCount},
  "role": "${slideRole}",
  "content": {
    "headline": "[Judul poin — maks 8 kata]",
    "subtext": "[Pembuka — 1-2 kalimat]",
    "detail": "[Penjelasan utama — 3-5 kalimat atau poin]",
    "microTip": "[Tips/fakta/badge singkat]"
  },
  "imagePrompt": {
    "visual": "[Deskripsi visual lengkap dan detail untuk slide ini]",
    "visualSummary": "[Ringkasan visual 1 kalimat]",
    "contentSummary": "[Ringkasan konten 1 kalimat]",
    "negativePrompt": "[Negative prompt standar]"
  }
}`;

    // Build sosmed aturan permanen untuk digital product
    const digitalSosmedAturan = buildDigitalSosmedAturan(i, validatedSlideCount);

    try {
      const slideResult = await callGroqApiWithRotation(promptInstruction);
      let parsed: any = null;

      if (slideResult) {
        const jsonMatch = slideResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsed = JSON.parse(jsonMatch[0]);
          } catch (parseErr) {
            console.warn(`Digital Product Slide ${i} JSON parse error:`, parseErr);
          }
        }
      }

      const slideOutput = formatSlideOutput({
        slideNumber: parsed?.slideNumber ?? i,
        totalSlides: parsed?.totalSlides ?? validatedSlideCount,
        role: parsed?.role ?? slideRole,
        designStyleName: designStyle,
        orientationSpec,
        stylePromptText,
        visualContent: parsed?.imagePrompt?.visual ?? `Visual produk digital premium Slide ${i} untuk ${aiTitle}`,
        negativePrompt: parsed?.imagePrompt?.negativePrompt ?? 'low quality, blurry, pixelated, noisy, cluttered, low contrast, text errors, watermark',
        headline: parsed?.content?.headline ?? (i === 1 ? aiTitle : `Slide ${i}`),
        subtext: parsed?.content?.subtext ?? '',
        detail: parsed?.content?.detail ?? '',
        microTip: parsed?.content?.microTip ?? '',
        isPromotional,
        targetAudience,
        mandatoryRules,
        mediaSosialAturan: digitalSosmedAturan,
        customInstruksiAwalWajib: DIGITAL_PRODUCT_SYSTEM_PROTOCOL,
      });

      const contentSummary = parsed?.imagePrompt?.contentSummary || slideOutput.teks_dalam_gambar.headline.substring(0, 100);
      const visualSummary = parsed?.imagePrompt?.visualSummary || slideOutput.deskripsi_visual.objek_dan_konteks.substring(0, 120);

      previousSlideContentSummaries.push(contentSummary);
      previousSlideVisualSummaries.push(visualSummary);
      finalPromptParts.push(JSON.stringify(slideOutput));

    } catch (e) {
      console.error(`Digital Product Slide ${i} generation failed:`, e);
      const fallbackSlide = formatSlideOutput({
        slideNumber: i,
        totalSlides: validatedSlideCount,
        role: slideRole,
        designStyleName: designStyle,
        orientationSpec,
        stylePromptText,
        visualContent: `Visual premium produk digital Slide ${i}: ${aiTitle}`,
        negativePrompt: 'low quality, blurry, pixelated, noisy, cluttered',
        headline: i === 1 ? aiTitle : `Slide ${i}: Info Produk`,
        subtext: '',
        detail: '',
        microTip: '',
        isPromotional,
        targetAudience,
        mandatoryRules,
        mediaSosialAturan: buildDigitalSosmedAturan(i, validatedSlideCount),
        customInstruksiAwalWajib: DIGITAL_PRODUCT_SYSTEM_PROTOCOL,
      });

      previousSlideContentSummaries.push(`Slide ${i}: ${slideRole}`);
      previousSlideVisualSummaries.push(`${slideRole} visual`);
      finalPromptParts.push(JSON.stringify(fallbackSlide));
    }
  }

  const styleName = designStyle.split('|')[0].trim();
  const styleAttributes = getStyleAttributes(styleName, stylePromptText);

  const fullCarouselObject = {
    aturan_global: {
      platform_target: "Instagram Carousel Post",
      peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
      target_audiens: targetAudience,
      jenis_konten: contentType || "Produk Digital",
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
      footer_bawah: `TikTok: ${DIGITAL_SOSMED_INFO.tiktok} | Instagram: ${DIGITAL_SOSMED_INFO.instagram} | Web: ${DIGITAL_SOSMED_INFO.website}`
    },
    daftar_slide: finalPromptParts.map(p => {
      try {
        return JSON.parse(p);
      } catch (_) {
        return p;
      }
    })
  };

  const generatedPrompt = JSON.stringify(fullCarouselObject);

  // ─── Step 5: Generate Captions Sosmed Khusus Produk Digital ─────────────────
  let instagramCaption = '';
  let tiktokCaption = '';
  let hashtags = '';

  if (shouldGenerateCaption) {
    try {
      // Custom caption generation untuk produk digital
      const captionPromptText = `Kamu adalah Social Media Copywriter Indonesia spesialis produk digital.
Buat caption untuk konten promosi produk digital:
- Produk: "${aiTitle}"
- Deskripsi: ${description}
${brand ? `- Brand/Penjual: ${brand}` : ''}
${price ? `- Harga: ${price}` : ''}
- Target Audiens: ${targetAudience}
- Gaya: ${designStyle}

SOSMED PEMILIK (WAJIB disebut di caption):
- Website: ${DIGITAL_SOSMED_INFO.website}
- TikTok: ${DIGITAL_SOSMED_INFO.tiktok}
- Instagram: ${DIGITAL_SOSMED_INFO.instagram}

ATURAN CAPTION:
- Bahasa Indonesia non-formal, santai, persuasif
- Sertakan info sosmed di bagian akhir caption
- Pakai emoji yang relevan

Buat:
1. CAPTION INSTAGRAM: 3-4 paragraf, ada hook kuat, CTA beli/DM, mention sosmed. Maks 2200 karakter.
2. CAPTION TIKTOK: Singkat, viral-friendly, maks 150 karakter, sertakan TikTok handle.
3. HASHTAGS: 15-20 hashtag campuran (produk digital, jualan online, dll).

Format PERSIS seperti ini:
===INSTAGRAM_CAPTION===
[isi]
===TIKTOK_CAPTION===
[isi]
===HASHTAGS===
[hashtag]`;

      const captionResult = await callGroqApiWithRotation(captionPromptText);
      if (captionResult) {
        const igMatch = captionResult.match(/===INSTAGRAM_CAPTION===\s*([\s\S]*?)(?====|$)/);
        const ttMatch = captionResult.match(/===TIKTOK_CAPTION===\s*([\s\S]*?)(?====|$)/);
        const hashMatch = captionResult.match(/===HASHTAGS===\s*([\s\S]*?)(?====|$)/);

        instagramCaption = igMatch ? igMatch[1].trim() : '';
        tiktokCaption = ttMatch ? ttMatch[1].trim() : '';
        hashtags = hashMatch ? hashMatch[1].trim() : '';
      }
    } catch (captionErr) {
      console.warn('Digital product caption generation failed:', captionErr);
    }
  }

  // ─── Step 6: Save to DB ───────────────────────────────────────────────────────
  const historyId = uuidv4();
  const finalContentType = contentType || 'Produk Digital';

  try {
    await query(
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, sourceImageUrl, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        historyId,
        userId,
        aiTitle,
        finalContentType,
        validatedSlideCount,
        designStyle,
        targetAudience,
        generatedPrompt,
        'Persegi (Square 1:1)',
        instagramCaption,
        tiktokCaption,
        hashtags,
        imageUrls.length > 0 ? imageUrls.join(',') : null
      ]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId, isDigitalProduct: true })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType: finalContentType,
      slideCount: validatedSlideCount,
      designStyle,
      targetAudience,
      language: 'ID',
      generatedPrompt,
      imageOrientation: 'Persegi (Square 1:1)',
      instagramCaption,
      tiktokCaption,
      hashtags,
      imageUrl: null,
      sourceImageUrl: imageUrls.length > 0 ? imageUrls.join(',') : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      // Info sosmed untuk referensi di app
      digitalSosmed: {
        website: DIGITAL_SOSMED_INFO.website,
        tiktok: DIGITAL_SOSMED_INFO.tiktok,
        instagram: DIGITAL_SOSMED_INFO.instagram,
      }
    });
  } catch (error: any) {
    console.error('Save digital product prompt history error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
