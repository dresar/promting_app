import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../../db';
import { callGroqApiWithRotation } from './groqService';
import {
  getOrientationSpec,
  getMandatoryRules,
  getTerminologyGlossary,
  getAudienceInstruction,
  generateSocialCaptions,
  formatSlideOutput,
  buildPromptFallback,
  getStylePromptText
} from './promptHelpers';

export const generatePrompt = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { title, contentType, slideCount, designStyle, targetAudience, imageOrientation, includeCaption, characterId, useCharacter } = req.body;
  if (!title || !contentType || !slideCount || !designStyle || !targetAudience) {
    return res.status(400).json({ message: 'Missing required parameters.' });
  }

  const orientationSpec = getOrientationSpec(imageOrientation || 'potret');
  const shouldGenerateCaption = includeCaption !== false && includeCaption !== 'false';

  let aiTitle = title;
  if (title.trim().length > 25) {
    try {
      const titlePrompt = `Kamu adalah Copywriter profesional. Buatlah judul ringkas (maks 5 kata) yang merangkum topik: "${title}". LANGSUNG berikan hasil judulnya saja, tanpa tanda kutip, tanpa awalan/akhiran.`;
      const summarizedTitle = await callGroqApiWithRotation(titlePrompt);
      if (summarizedTitle && summarizedTitle.trim().length > 0) {
        aiTitle = summarizedTitle.trim().replace(/^"|"$/g, '').trim();
      }
    } catch (e) {
      console.warn('Gagal membuat judul ringkas via Groq:', e);
    }
  }

  let generatedPrompt = '';
  let stylePromptText = '';
  let characterPromptText = '';
  let characterName = '';
  const shouldAddCharacter = useCharacter === true || useCharacter === 'true';

  const contentTypeLower = contentType.toLowerCase();
  const isPromotional = (
    contentTypeLower.includes('iklan') || 
    contentTypeLower.includes('promo') ||
    contentTypeLower.includes('showcase') ||
    contentTypeLower.includes('ads')
  ) && !contentTypeLower.includes('edukasi');

  // Get mandatory rules and terminology for this content type
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  const terminology = getTerminologyGlossary(isPromotional);

  try {
    // Fetch style or theme prompt from DB
    stylePromptText = await getStylePromptText(designStyle);

    // Fetch character if enabled
    if (shouldAddCharacter && characterId) {
      try {
        const charRows = await query('SELECT name, prompt FROM characters WHERE id = ?', [characterId]);
        if (charRows.rows && charRows.rows.length > 0) {
          characterName = charRows.rows[0].name;
          characterPromptText = charRows.rows[0].prompt || '';
        }
      } catch (charErr) {
        console.warn('Failed to fetch character from DB:', charErr);
      }
    }

    const audienceInstruction = getAudienceInstruction(targetAudience);

    // Parse the bgLabel from designStyle parameter
    let bgLabel = '';
    const styleParts = designStyle.split('|');
    const styleName = styleParts[0].trim();
    if (styleParts.length > 1) {
      for (const part of styleParts) {
        const trimmedPart = part.trim();
        if (trimmedPart.toLowerCase().startsWith('latar:')) {
          bgLabel = trimmedPart.substring(6).trim();
        }
      }
    }
    if (!bgLabel) {
      bgLabel = 'Putih Bersih'; // Default fallback
    }

    const daftarSlideSkeleton = Array.from({ length: slideCount }).map((_, idx) => {
      const slideNumber = idx + 1;
      let role = `POIN EDUKASI #${slideNumber - 1}`;
      if (slideNumber === 1) role = "HOOK & COVER EDUKASI (Slide Pembuka)";
      if (slideNumber === slideCount) role = "PENUTUP & AJAK INTERAKSI (Slide Terakhir)";
      
      return `    {
      "slideNumber": ${slideNumber},
      "role": "${role}",
      "urutan_alur_belajar": "Step ${slideNumber} dari ${slideCount}: ${slideNumber === 1 ? 'Pengenalan & Hook' : slideNumber === slideCount ? 'Kesimpulan & CTA' : 'Penjelasan Materi'}",
      "objek_visual": "[Deskripsikan elemen visual / ilustrasi spesifik untuk slide ${slideNumber} yang BERBEDA dari slide lainnya, tapi WAJIB mencantumkan penggunaan latar ${bgLabel}]",
      "teks_dalam_gambar": {
        "headline": "[${slideNumber === 1 ? 'Headline/Hook menarik' : slideNumber === slideCount ? 'Kesimpulan pendek' : 'Judul poin edukasi (maks 8 kata)'}]",
        "subtext": "[${slideNumber === 1 ? 'Opsional subtext' : slideNumber === slideCount ? 'Kosongkan' : '1-2 kalimat santai pembuka penjelasan'}]",
        "detail": "[${slideNumber === 1 ? 'Kosongkan' : slideNumber === slideCount ? 'Kosongkan' : '3-5 kalimat penjelas lengkap dan asik dibaca'}]",
        "microTip": "[${slideNumber === 1 ? 'Kosongkan' : slideNumber === slideCount ? 'Ajakan Save, Share, Follow' : '1 kalimat tips praktis'}]"
      }
    }`;
    }).join(',\n');

    let characterInstruction = '';
    if (shouldAddCharacter && characterPromptText) {
      characterInstruction = `
==================================================
ATURAN KARAKTER (WAJIB KONSISTEN):
Kamu WAJIB menyertakan karakter berikut di dalam deskripsi 'objek_visual' pada setiap slide:
- Nama Karakter: "${characterName}"
- Deskripsi Visual Karakter (Wajib disertakan persis seperti ini di setiap slide agar gambar konsisten): "${characterPromptText}"
- Posisi & Gerakan: Kamu (Groq) bebas menentukan pose, gerakan, atau ekspresi karakter yang bervariasi di setiap slide agar presentasi dinamis (misal: menunjuk ke teks, memegang dagu sedang berpikir, ekspresi senang menyapa audiens, dsb).
- Konsistensi: Pastikan warna baju, gaya rambut, dan ciri visual lainnya selalu konsisten di semua slide.
`;
    } else {
      characterInstruction = `
==================================================
ATURAN KARAKTER (DILARANG ADA KARAKTER):
- Kamu dilarang keras memunculkan karakter manusia, maskot, avatar, atau orang di dalam deskripsi 'objek_visual' pada semua slide.
- Slide visual HANYA boleh berisi elemen grafis, ilustrasi objek benda mati, diagram, infografis, mock-up, atau visual abstrak yang sesuai dengan judul dan materi konten.
`;
    }

    const singleGroqPrompt = `Kamu adalah Senior Graphic Designer, Art Director, dan Copywriter profesional yang sangat ahli dalam merancang carousel edukasi media sosial yang estetik, rapi, dan memiliki kombinasi visual premium.
 
Tugasmu adalah menghasilkan SATU data terstruktur lengkap untuk carousel dalam format JSON murni.
 
INFORMASI PROJECT:
- Judul / Topik Utama: "${title}"
- Jenis Konten: "${contentType}"
- Jumlah Slide: ${slideCount}
- Target Audiens: "${targetAudience}"
- Gaya Desain Utama: "${styleName}"
- Deskripsi Gaya Utama (Penting): "${stylePromptText || 'Gaya profesional dan minimalis'}"
- Tema Latar Belakang / Warna Pilihan: "${bgLabel}"
- Orientasi Gambar: "${orientationSpec.spec}" (Rasio: ${orientationSpec.ratio})
 
==================================================
ATURAN KONSISTENSI WARNA & VISUAL (SANGAT PENTING):
1. Pilihan warna latar belakang user adalah: "${bgLabel}".
2. Kamu WAJIB menerapkan warna/latar tersebut pada seluruh slide secara konsisten!
3. Di dalam array 'daftar_slide', setiap deskripsi 'objek_visual' harus mencantumkan penggunaan latar "${bgLabel}".
${characterInstruction}

==================================================
ATURAN TEKS KONTEN EDUKASI (WAJIB DIPATUHI 100%):
- Gunakan bahasa non-formal, santai, asik (BUKAN seperti buku pelajaran).
- Batas Teks: Headline maksimal 10 kata, subtext 15 kata, detail 60 kata, microTip 20 kata.
- Selipkan kata-kata edukasi wajib: fakta menarik, tahukah kamu, tips praktis, insight penting, cara mudah.
- Dilarang keras menyebut harga, diskon, promo produk, atau jualan.

==================================================
FORMAT OUTPUT JSON YANG HARUS KAMU HASILKAN:
Kamu wajib mengembalikan output 1 JSON object murni LENGKAP tanpa terpotong-potong. 
JANGAN memecah menjadi beberapa JSON. JANGAN berikan teks penjelasan.
Pastikan array "daftar_slide" berisi TEPAT ${slideCount} object sesuai jumlah slide.
Struktur HARUS persis seperti contoh di bawah (tanda kutip telah disesuaikan agar format JSON valid):

{
  "judul_project": "${title} - Carousel Edukasi ${slideCount} Slide",
  "instruksi_cara_kerja_ai": "PERINTAH UTAMA — BACA DAN INGAT SELAMA SESI INI BERLANGSUNG:\\nIni adalah satu paket prompt master untuk membuat ${slideCount} gambar carousel edukasi secara berurutan. JANGAN generate semua ${slideCount} gambar sekaligus. Ikuti alur kerja berikut:\\n\\n1. KONFIRMASI: Setelah membaca prompt ini, berikan rangkuman singkat bahwa kamu paham aturan global, gaya visual, dan daftar ${slideCount} slide, lalu TUNGGU perintah 'lanjut'.\\n2. EKSEKUSI PER SLIDE: Setiap user mengetik 'lanjut' atau 'next', generate SATU gambar untuk slide berikutnya sesuai urutan.\\n3. KONSISTENSI KARAKTER & VISUAL (FITUR WAJIB): Simpan metadata visual (warna dominan, ciri fisik karakter, pakaian, jenis lighting, environment/background) di ingatanmu. Gunakan seed atau deskripsi referensi yang identik di setiap prompt gambar selanjutnya untuk mempertahankan konsistensi identitas.\\n4. VARIASI ANGLE & KOMPOSISI: Selalu bandingkan rencana komposisi slide baru dengan slide sebelumnya. Variasikan angle kamera (close-up, medium shot, wide shot, top-down) dan posisi objek utama agar tidak repetitif, NAMUN tetap 100% patuh pada 'gaya_visual_global'.\\n5. KONSISTENSI UI/OVERLAY: Pastikan elemen UI seperti nomor slide, CTA follow, dan footer diletakkan pada posisi pixel yang identik di setiap gambar.\\n6. ATURAN LATAR/BACKGROUND: WAJIB gunakan latar belakang dengan nuansa ${bgLabel} di seluruh slide.\\n7. PROGRESS TRACKING: Jika ditanya 'sudah sampai mana', berikan laporan progres dari total ${slideCount} slide.",
  "aturan_global": {
    "platform_target": "Instagram Carousel Post",
    "peran": "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
    "target_audiens": "${targetAudience}",
    "level_kesulitan_konten": "Pemula total, asumsikan audiens belum pernah lihat materi ini sebelumnya. Gunakan analogi sehari-hari dan jangan terlalu teknis.",
    "jenis_konten": "${contentType}",
    "catatan_render_kode": "TIDAK BOLEH generate teks sintaks kode presisi (<p>, <a>, dll) sebagai teks asli dalam gambar. AI cukup membuat ilustrasi visual yang menyerupai blok kode dengan syntax highlighting (tanpa teks presisi) untuk diedit manual nantinya.",
    "bahasa_teks_overlay": "Non-formal, santai, dan asik. Bicara seperti kakak/teman yang berbagi ilmu, BUKAN seperti buku pelajaran atau artikel jurnal.",
    "batas_teks": "Maksimal 10 kata per elemen teks (headline, subtext, detail, microTip). Ringkas, padat, cepat dibaca.",
    "satu_poin_per_slide": "Satu slide = satu insight/tips/fakta yang disampaikan jelas dan mudah dicerna.",
    "terminologi_wajib_diselipkan": ["fakta menarik", "tahukah kamu", "tips praktis", "jangan sampai salah", "insight penting", "studi menunjukkan", "cara mudah", "langkah simpel", "bukti nyata", "ternyata begini", "coba deh", "bisa langsung dipraktekin"],
    "larangan": "DILARANG KERAS menyebut harga, diskon, promo produk, atau jualan apapun dalam konten edukasi ini.",
    "call_to_action_variatif": "Selain save/share/follow, variasikan ajakan: misal ajak komentar (\\"Tag HTML favoritmu apa?\\"), atau praktik (\\"Coba tag ini sekarang di text editor kamu\\") agar lebih interaktif."
  },
  "gaya_visual_global": {
    "gaya_visual_wajib": "${(stylePromptText || designStyle).replace(/"/g, '\\"')}",
    "gaya_dominan": "${styleName} dengan perpaduan elemen profesional.",
    "rasio_komposisi": "70% area ilustrasi/kode visual, 30% area teks (whitespace luas) agar AI tidak menginterpretasi bebas proporsi tiap slide.",
    "tata_letak_hierarki": "Struktur grid yang rapi, rapi, dan teratur. Whitespace luas, margin seimbang, penataan informasi yang efisien.",
    "elemen_pendukung": "Garis tipis pembatas, ikon pendukung minimalis, elemen yang sesuai dengan ${styleName}.",
    "gaya_ikon_konsisten": "Flat line icon, duotone, stroke 2px, sudut membulat. Konsisten satu sistem di seluruh slide.",
    "palet_warna": {
      "dasar_netral": ["Deep Navy Blue (#0F2D52)", "Charcoal Gray (#4B5563)", "Off-White (#FAFAFA)", "${bgLabel}"],
      "aksen": ["Steel Blue (#3B82F6)", "Subtle Silver (#E5E7EB)"]
    },
    "tipografi": "Sans-serif premium. Headline bold ukuran besar, subtext/detail teks rapi dan teratur dengan kontras tinggi.",
    "tipografi_kode": "Font khusus untuk elemen menyerupai kode program: Fira Code / JetBrains Mono, monospace, dengan warna syntax-highlight (keyword biru, string hijau, tag oranye).",
    "variasi_wajib_per_slide": "Harus memiliki variasi angle kamera, rotasi posisi ilustrasi (kiri/kanan), dan variasi warna aksen dominan per slide untuk menghindari kebosanan.",
    "referensi_visual_brand": "Desain harus memiliki identitas visual \\"Series Edukasi\\" yang ajeg, sehingga konten-konten lain selanjutnya memiliki benang merah yang sama.",
    "pencahayaan_kamera": "Clean studio lighting, pencahayaan merata dan netral, sudut kamera lurus (eye-level) atau top-down datar.",
    "kedalaman_visual": "Layering berlapis tipis, margin bersih, bayangan drop-shadow yang sangat halus.",
    "dimensi_canvas": "Canvas ${orientationSpec.widthHint}px, Aspect Ratio ${orientationSpec.ratio} (--ar ${orientationSpec.ratio})",
    "negative_prompt": "watermark, blur, teks berantakan, kualitas buruk, anatomi aneh, font aneh, terlalu ramai"
  },
  "layout_media_sosial_global": {
    "pojok_kiri_atas": "Overlay kotak berwarna biru berisi nomor slide (format 'X/${slideCount}'), sesuaikan angka per slide.",
    "pojok_kanan_atas": "Overlay warna konsisten berisi teks ajakan follow: 'Jangan lupa follow!'.",
    "tengah_atas_footer": "Ikon atau teks navigasi swipe ('Swipe right' / panah kanan) untuk ajak audiens geser slide.",
    "footer_bawah": "Terpusat, minimalis, tanpa label teks pengantar (ikon langsung diikuti teks):\\n- Ikon Instagram + \\"arif_ex21\\"\\n- Ikon Web/Globe + \\"https://www.inka.my.id/\\"\\n- Ikon GitHub + \\"github.com/dresar\\""
  },
  "daftar_slide": [
${daftarSlideSkeleton}
  ]
}

PASTIKAN MENGHASILKAN HANYA 1 OBJEK JSON MURNI TANPA TEKS LAIN SEBELUM DAN SESUDAHNYA. JANGAN MENGGUNAKAN MARKDOWN \`\`\`json. LENGKAPI SELURUH ${slideCount} ISI ARRAY DAFTAR_SLIDE.`;

    const resultJson = await callGroqApiWithRotation(singleGroqPrompt);
    let cleanedJson = resultJson.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Ensure gaya_visual_global and palet_warna are present and consistent
        if (!parsed.gaya_visual_global) parsed.gaya_visual_global = {};
        if (!parsed.gaya_visual_global.palet_warna) {
          parsed.gaya_visual_global.palet_warna = {
            dasar_netral: ["Off-White (#FAFAFA)", "Charcoal Gray (#4B5563)", bgLabel],
            aksen: []
          };
        }
        
        const baseColors = parsed.gaya_visual_global.palet_warna.dasar_netral || [];
        if (!baseColors.some((c: string) => c.toLowerCase().includes(bgLabel.toLowerCase()))) {
          baseColors.unshift(bgLabel);
          parsed.gaya_visual_global.palet_warna.dasar_netral = baseColors;
        }

        generatedPrompt = JSON.stringify(parsed, null, 2);
      } catch (parseErr) {
        console.warn('JSON parsing failed, saving raw prompt result:', parseErr);
        generatedPrompt = jsonMatch[0]; // simpan hasil match terbersih
      }
    } else {
      generatedPrompt = cleanedJson;
    }
  } catch (err: any) {
    console.error('Core generation logic error, compiling fallback:', err);
    generatedPrompt = buildPromptFallback(aiTitle, contentType, slideCount, designStyle, targetAudience);
  }

  let instagramCaption = '';
  let tiktokCaption = '';
  let hashtags = '';

  if (shouldGenerateCaption) {
    try {
      const captions = await generateSocialCaptions(
        aiTitle,
        contentType,
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
      `INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, imageOrientation, instagramCaption, tiktokCaption, hashtags, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, ?, ?, ?, ?, NOW(), NOW())`,
      [historyId, userId, aiTitle, contentType, slideCount, designStyle, targetAudience, generatedPrompt,
       imageOrientation || 'Persegi (Square 1:1)', instagramCaption, tiktokCaption, hashtags]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId })]
    );

    return res.status(201).json({
      id: historyId,
      userId,
      title: aiTitle,
      contentType,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
    });
  } catch (error: any) {
    console.error('Save prompt history error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
