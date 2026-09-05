import { callGroqApiWithRotation } from './groqService';
import { query } from '../../db';

export const getOrientationSpec = (orientation: string): { ratio: string; widthHint: string; spec: string } => {
  const lower = orientation.toLowerCase();
  // TikTok / Instagram potret 3:4 — new format OR legacy
  if (lower.includes('3:4') || lower.includes('1440') || lower.includes('tiktok') || lower.includes('instagram potret')) {
    return {
      ratio: '3:4',
      widthHint: '1080x1440',
      spec: 'Potret TikTok/Instagram (3:4) vertikal — Canvas: 1080x1440px. Character at bottom corner. Text area: upper 40% of canvas. Safe Area: 80px from all edges.',
    };
  } else if (lower.includes('4:5') || lower.includes('1350')) {
    return {
      ratio: '4:5',
      widthHint: '1080x1350',
      spec: 'Potret Instagram (4:5) vertikal — Canvas: 1080x1350px. Character at bottom corner. Text area: upper 35% of canvas.',
    };
  } else if (lower.includes('landscape') || lower.includes('16:9') || lower.includes('1920') || lower.includes('persegi panjang')) {
    return {
      ratio: '16:9',
      widthHint: '1920x1080',
      spec: 'Landscape/Persegi Panjang (16:9) horizontal — Canvas: 1920x1080px. Character at bottom-right corner. Text area: left 50% of canvas.',
    };
  } else if (lower.includes('square') || lower.includes('persegi') || lower.includes('1:1') || lower.includes('1080x1080')) {
    return {
      ratio: '1:1',
      widthHint: '1080x1080',
      spec: 'Persegi (1:1) — Canvas: 1080x1080px. Character at bottom corner. Text area: upper-center of canvas. Safe Area: 80px from all edges.',
    };
  } else if (lower.includes('portrait') || lower.includes('potret')) {
    return {
      ratio: '4:5',
      widthHint: '1080x1350',
      spec: 'Potret (4:5) vertikal — Canvas: 1080x1350px. Character at bottom corner. Text area: upper 35% of canvas.',
    };
  } else {
    // Default: 3:4 TikTok Portrait
    return {
      ratio: '3:4',
      widthHint: '1080x1440',
      spec: 'Potret TikTok/Instagram (3:4) vertikal — Canvas: 1080x1440px. Character at bottom corner. Text area: upper 40% of canvas. Safe Area: 80px from all edges.',
    };
  }
};


export const getMandatoryRules = (isPromotional: boolean, orientationSpec: { ratio: string; widthHint: string; spec: string }): string => {
  if (isPromotional) {
    return `
=== ATURAN WAJIB AI — KONTEN IKLAN/PROMO (HARUS DIPATUHI 100%) ===
1. BAHASA: Gunakan bahasa non-formal, semangat, dan persuasif. Bicara langsung ke audiens seperti teman yang meyakinkan, BUKAN seperti brosur formal atau iklan koran.
2. TEKS KONTEN SANGAT RINGKAS: Buat teks overlay (headline, subtext, detail, microTip) sesingkat dan sepadat mungkin. Maksimal 10 kata per elemen. Jangan sampai teks menumpuk atau terlalu panjang di gambar.
3. KAYA VISUAL & ILUSTRASI: Berikan penjelasan objek visual latar, karakter, atau vektor secara mendetail, kaya, dan profesional. Fokuslah mendeskripsikan elemen grafis pendukung yang menarik mata.
4. SATU POIN PER SLIDE: Satu slide = satu pesan utama yang disampaikan dengan BOLD dan percaya diri.
5. TERMINOLOGI IKLAN yang WAJIB diselipkan: promo terbatas, stok mepet, harga spesial hari ini, daftar sekarang jangan tunda, garansi kepuasan, testimoni nyata, bonus eksklusif, harga coret, limited edition, early bird.
6. CTA TEGAS: Slide terakhir wajib ada Call to Action yang spesifik (DM sekarang / klik link / hubungi WA / beli sebelum kehabisan).
7. DIMENSI CANVAS & ASPECT RATIO (MUTLAK): Gunakan Canvas ${orientationSpec.widthHint}px (Aspect Ratio ${orientationSpec.ratio}). Posisikan semua teks dan ikon di area tengah, beri Safe Area minimal 80-120 px dari seluruh sisi tepi luar canvas agar tidak terpotong di berbagai resolusi layar.
=== END ATURAN WAJIB ===`;
  } else {
    return `
=== ATURAN WAJIB AI — KONTEN EDUKASI/INFORMASI (HARUS DIPATUHI 100%) ===
1. BAHASA: Gunakan bahasa non-formal, santai, dan asik. Bicara seperti kakak/teman yang berbagi ilmu, BUKAN seperti buku pelajaran atau artikel jurnal.
2. TEKS KONTEN SANGAT RINGKAS: Buat teks overlay (headline, subtext, detail, microTip) sesingkat dan sepadat mungkin. Maksimal 10 kata per elemen. Teks di media sosial harus cepat dibaca dan tidak membosankan.
3. KAYA VISUAL & ILUSTRASI: Berikan penjelasan objek visual latar, karakter, atau vektor secara mendetail, kaya, dan profesional. Fokuslah mendeskripsikan elemen grafis pendukung yang edukatif dan menarik mata.
4. SATU POIN PER SLIDE: Satu slide = satu insight/tips/fakta yang disampaikan dengan jelas dan mudah dicerna.
5. TERMINOLOGI EDUKASI yang WAJIB diselipkan: fakta menarik, tahukah kamu, tips praktis, jangan sampai salah, insight penting, studi menunjukkan, cara mudah, langkah simpel, bukti nyata, ternyata begini, coba deh, bisa langsung dipraktekin.
6. PENUTUP AJAK INTERAKSI: Slide terakhir ajak audiens save, share ke teman, follow untuk konten serupa, atau tanya pendapat mereka di kolom komentar.
7. BEBAS PROMOSI: DILARANG KERAS menyebut harga, diskon, promo produk, atau jualan apapun dalam konten edukasi ini.
8. DIMENSI CANVAS & ASPECT RATIO (MUTLAK): Gunakan Canvas ${orientationSpec.widthHint}px (Aspect Ratio ${orientationSpec.ratio}). Posisikan semua teks dan ikon di area tengah, beri Safe Area minimal 80-120 px dari seluruh sisi tepi luar canvas agar tidak terpotong di berbagai resolusi layar.
=== END ATURAN WAJIB ===`;
  }
};

export const getTerminologyGlossary = (isPromotional: boolean): string => {
  if (isPromotional) {
    return `
--- Daftar Istilah Iklan yang Bisa Dipakai ---
• "Penawaran terbatas" / "Stok terbatas" → ciptakan urgency
• "Harga spesial hari ini" / "Diskon X%" → angka konkret lebih meyakinkan
• "Garansi uang kembali" / "Garansi kepuasan" → hilangkan rasa takut
• "Sudah dipercaya X ribu pelanggan" → social proof
• "Eksklusif hanya untuk kamu" / "Member only" → rasa spesial
• "Langsung bisa dipakai / langsung kerasa manfaatnya" → bukti cepat
• "DM sekarang" / "Klik link di bio" / "Hubungi WA kami" → CTA spesifik
• "Jangan tunda lagi" / "Ini saat yang tepat" → overcome procrastination
• "Tanpa ribet" / "Mudah banget caranya" → hilangkan hambatan
• "Coba gratis dulu" / "Tidak ada syarat tersembunyi" → mengurangi risiko`;
  } else {
    return `
--- Daftar Istilah Edukasi yang Bisa Dipakai ---
• "Tahukah kamu?" / "Fakta mengejutkan:" → memancing rasa ingin tahu
• "Ternyata begini cara kerjanya..." → mengungkap sesuatu yang belum diketahui
• "Tips praktis #X:" / "Cara mudah #X:" → format listicle yang mudah dicerna
• "Studi menunjukkan bahwa..." / "Riset terbaru membuktikan..." → kredibilitas
• "Kebanyakan orang salah paham soal ini..." → koreksi mitos
• "Langsung bisa dipraktekin!" / "Coba sekarang:" → actionable
• "Ini yang bikin kamu stuck:" / "Root cause-nya adalah..." → problem framing
• "Intinya:" / "Singkatnya begini:" / "Kesimpulannya:" → simplifikasi
• "Simpan dulu, nanti butuh!" → dorong save
• "Share ke teman yang perlu tahu ini!" → dorong share`;
  }
};

export const getAudienceInstruction = (targetAudience: string): string => {
  const aud = targetAudience.toLowerCase();
  
  let instructions = `Sesuaikan gaya bahasa (copywriting) berdasarkan Target Audiens: "${targetAudience}".\nAturan penyesuaian khusus:\n`;
  
  if (aud.includes('mahasiswa') || aud.includes('pelajar') || aud.includes('muda')) {
    instructions += `- Bahasa: Kasual, kekinian, trendi, bersemangat, pakai istilah populer anak muda (tetap sopan). Boleh pakai kata "kamu", "gue", "guys", "bro/sis" sesekali.\n` +
                    `- Visual: Modern, trendi, dinamis, minimalis kekinian.\n`;
  } else if (aud.includes('orang tua') || aud.includes('lansia') || aud.includes('dewasa akhir')) {
    instructions += `- Bahasa: Sederhana, mudah dipahami, hangat, hormat. Hindari singkatan atau istilah asing.\n` +
                    `- Visual: Kontras tinggi, font jelas dan besar, elemen visual yang familiar.\n`;
  } else if (aud.includes('pebisnis') || aud.includes('umkm') || aud.includes('usaha')) {
    instructions += `- Bahasa: Benefit-oriented, solutif, memotivasi, profesional tapi praktis (straight to the point).\n` +
                    `- Visual: Bersih, terpercaya, profesional, penekanan pada poin utama.\n`;
  } else if (aud.includes('karyawan') || aud.includes('profesional')) {
    instructions += `- Bahasa: Sopan, formal-kasual (smart casual), berbobot, berbasis data/fakta.\n` +
                    `- Visual: Elegan korporat, rapi, terstruktur, minimalis modern.\n`;
  } else if (aud.includes('ibu') || aud.includes('keluarga')) {
    instructions += `- Bahasa: Ramah, hangat, empati tinggi, praktis, fokus pada kehidupan sehari-hari.\n` +
                    `- Visual: Warna hangat (soft pastel), tata letak bersih.\n`;
  } else {
    instructions += `- Bahasa: Indonesia yang baik, umum, komunikatif, bersahabat, mudah dicerna.\n` +
                    `- Visual: Seimbang, bersih, kontras tinggi untuk keterbacaan baik.\n`;
  }
  
  instructions += `PENTING: Jangan tulis frasa mentah "untuk ${targetAudience}" di slide. Biarkan pemahaman audiens tercermin secara alami dari diksi dan nuansa penyampaian.`;
  
  return instructions;
};

export const buildPromptFallback = (
  title: string,
  contentType: string,
  slideCount: number,
  designStyle: string,
  targetAudience: string,
  imageOrientation?: string
): string => {
  const contentTypeLower = contentType.toLowerCase();
  const isPromotional = (
    contentTypeLower.includes('iklan') || 
    contentTypeLower.includes('promo') ||
    contentTypeLower.includes('showcase') ||
    contentTypeLower.includes('ads')
  ) && !contentTypeLower.includes('edukasi');

  // Determine orientation spec
  let orientation = imageOrientation || 'potret';
  if (!imageOrientation && designStyle.includes('|')) {
    const parts = designStyle.split('|');
    for (const part of parts) {
      if (part.includes('Orientasi:')) {
        orientation = part.replace('Orientasi:', '').trim();
      }
    }
  }
  const orientationSpec = getOrientationSpec(orientation);
  
  const styleName = designStyle.split('|')[0].trim();
  const mandatoryRules = getMandatoryRules(isPromotional, orientationSpec);
  
  const slides = Array.from({ length: slideCount }, (_, idx) => {
    const n = idx + 1;
    let role = '';
    let headline = '';
    let subtext = '';
    let detail = '';
    let microTip = '';
    let visualContent = '';
    let mediaSosialAturan = '';

    if (n === 1) {
      role = isPromotional ? 'HOOK & PENAWARAN UTAMA (Banner Pertama)' : 'HOOK & COVER EDUKASI (Slide Pembuka)';
      headline = isPromotional ? `Penawaran Spesial ${title}` : title;
      subtext = isPromotional ? 'Jangan sampai kelewatan!' : 'Kamu udah tahu fakta penting ini belum?';
      detail = isPromotional ? 'Stok terbatas, ambil sekarang sebelum kehabisan.' : 'Banyak orang masih salah kaprah soal topik ini.';
      visualContent = isPromotional 
        ? `Latar belakang produk premium mewah dengan ${title} di tengah.` 
        : `Latar belakang bersih minimalis dengan tipografi besar membahas ${title}.`;
    } else if (n === slideCount) {
      role = isPromotional ? 'CALL TO ACTION & URGENCY (Slide Penutup)' : 'PENUTUP & AJAK INTERAKSI (Slide Terakhir)';
      headline = isPromotional ? 'Jangan Tunda Lagi!' : 'Simpan & Share!';
      subtext = isPromotional ? 'DM sekarang atau klik link di bio.' : 'Kalau info ini berguna buat kamu, share ke teman yang perlu tahu!';
      detail = isPromotional ? 'Garansi kepuasan, harga spesial hari ini saja.' : `Follow untuk tips ${title} lainnya setiap hari.`;
      visualContent = isPromotional 
        ? 'Latar belakang dengan tombol call to action yang kontras dan mencolok.' 
        : 'Latar belakang minimalis dengan ikon interaksi sosial media.';
    } else {
      role = isPromotional ? `FITUR/MANFAAT PRODUK #${n - 1}` : `POIN EDUKASI #${n - 1}`;
      headline = isPromotional ? `Keunggulan ${title} #${n - 1}` : `Tips Praktis #${n - 1}`;
      subtext = isPromotional ? 'Ini yang bikin beda dari yang lain.' : `Poin penting yang perlu kamu tahu tentang ${title}.`;
      detail = isPromotional ? 'Sudah dipercaya ribuan pelanggan yang puas.' : 'Fakta menarik: ternyata begini cara kerjanya!';
      visualContent = isPromotional 
        ? `Latar belakang produk minimalis modern menonjolkan fitur #${n - 1}.` 
        : `Ilustrasi visual modern pendukung poin #${n - 1} tentang ${title}.`;
    }

    if (isPromotional) {
      mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, tampilkan teks nomor halaman/slide: "${n}/${slideCount}".
- Di pojok kanan atas gambar, tampilkan teks ajakan follow: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan info produk.`;
    } else {
      mediaSosialAturan = `Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
- Di pojok kiri atas gambar, buat sebuah overlay kotak berwarna biru dan tampilkan teks nomor halaman/slide saat ini: "${n}/${slideCount}".
- Di pojok kanan atas gambar, buat sebuah overlay dengan warna tersendiri yang konsisten dan tampilkan teks ajakan follow yang manis: "Jangan lupa follow!".
- Di tengah, tepat di atas footer, tambahkan ikon atau teks navigasi swipe ("Swipe right" atau panah ke kanan) untuk mengajak audiens menggeser slide.
- Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan informasi sosial media dengan ikon/logo grafis saja tanpa label teks pengantar:
  * Tampilkan ikon/logo Instagram diikuti langsung oleh nama pengguna "arif_ex21" (tanpa kata "Logo" atau "Instagram" di depan).
  * Tampilkan ikon/logo Web/Globe diikuti langsung oleh link website "https://www.inka.my.id/" (tanpa kata "Web" di depan).
  * Tampilkan ikon/logo GitHub diikuti langsung oleh link GitHub "github.com/dresar" (tanpa kata "GitHub" di depan).`;
    }

    const slideObj = formatSlideOutput({
      slideNumber: n,
      totalSlides: slideCount,
      role,
      designStyleName: designStyle,
      orientationSpec,
      stylePromptText: '',
      visualContent,
      negativePrompt: 'low quality, blurry, pixelated, noisy image, cluttered, low contrast',
      headline,
      subtext,
      detail,
      microTip: microTip,
      isPromotional,
      targetAudience,
      mandatoryRules,
      mediaSosialAturan
    });

    return slideObj;
  });

  return JSON.stringify(slides);
};

export const generateSocialCaptions = async (
  title: string,
  contentType: string,
  targetAudience: string,
  designStyle: string,
  isPromotional: boolean,
  stylePrompt: string
): Promise<{ instagramCaption: string; tiktokCaption: string; hashtags: string }> => {
  const tone = isPromotional
    ? 'persuasif, menjual, dengan urgency dan CTA kuat, bahasa non-formal bersemangat'
    : 'edukatif, informatif, inspiratif, bahasa santai dan asik seperti teman berbagi ilmu';

  const captionPrompt = `Kamu adalah Social Media Copywriter profesional Indonesia.
Buat caption media sosial untuk konten ini:
- Topik: "${title}"
- Jenis: ${contentType}
- Audiens: ${targetAudience}
- Gaya Desain: ${designStyle}
${stylePrompt ? `- Visual Style Guide: "${stylePrompt}"` : ''}
- Tone: ${tone}

ATURAN CAPTION:
- Bahasa Indonesia non-formal, santai, seperti ngobrol sama teman
- Pakai emoji yang relevan dan natural
- Jangan kaku atau seperti siaran pers

Buat:
1. CAPTION INSTAGRAM: 2-4 paragraf pendek, engaging, ada hook di awal, ada CTA di akhir. Maks 2200 karakter.
2. CAPTION TIKTOK: Singkat, viral-friendly, ada hook kuat di baris pertama. Maks 150 karakter.
3. HASHTAGS: 15-20 hashtag campuran (besar + medium + niche), pisah dengan spasi.

Format output PERSIS seperti ini:
===INSTAGRAM_CAPTION===
[isi disini]
===TIKTOK_CAPTION===
[isi disini]
===HASHTAGS===
[hashtag disini]`;

  try {
    const raw = await callGroqApiWithRotation(captionPrompt);
    
    const igMatch = raw.match(/===INSTAGRAM_CAPTION===\s*([\s\S]*?)(?====TIKTOK_CAPTION===|$)/);
    const ttMatch = raw.match(/===TIKTOK_CAPTION===\s*([\s\S]*?)(?====HASHTAGS===|$)/);
    const hashMatch = raw.match(/===HASHTAGS===\s*([\s\S]*?)$/);

    const instagramCaption = igMatch ? igMatch[1].trim() : `✨ ${title}\n\nKonten spesial buat kamu yang mau tau lebih banyak!\n\n💡 Simpan dulu biar gak ketinggalan!\n📌 Share ke teman yang butuh info ini!\n\n#konten #indonesia`;
    const tiktokCaption = ttMatch ? ttMatch[1].trim() : `${title} 🔥 Wajib kamu tahu! #fyp #viral #indonesia`;
    const hashtags = hashMatch ? hashMatch[1].trim() : `#${title.replace(/\s+/g, '')} #konten #indonesia #viral #fyp #mediasosial`;

    return { instagramCaption, tiktokCaption, hashtags };
  } catch (e) {
    console.warn('Caption generation failed, using fallback:', e);
    return {
      instagramCaption: `✨ ${title}\n\nKonten terbaik buat ${targetAudience}! Jangan lupa simpan dan share ke teman-teman ya!\n\n💬 Komen pendapatmu di bawah!\n📌 Follow untuk konten seru lainnya!\n\n#konten #mediasosial #indonesia`,
      tiktokCaption: `${title} 🔥 Wajib tonton sampai habis! #fyp #viral #indonesia`,
      hashtags: `#${designStyle.split('|')[0].trim().replace(/\s+/g, '')} #${contentType.replace(/\s+/g, '')} #konten #mediasosial #indonesia #viral #fyp #edukasi #tips`,
    };
  }
};

export interface StyleDetail {
  gaya_dominan: string;
  gaya_visual_wajib: string;
  layout_dan_hierarki: string;
  elemen_infografis_pendukung: string;
  palet_warna: string;
  tipografi: string;
  pencahayaan_dan_kamera: string;
  kedalaman_visual: string;
}

export interface SlideOutputParams {
  slideNumber: number;
  totalSlides: number;
  role: string;
  designStyleName: string;
  orientationSpec: { ratio: string; widthHint: string; spec: string };
  stylePromptText: string;
  visualContent: string;
  negativePrompt: string;
  headline: string;
  subtext: string;
  detail: string;
  microTip: string;
  isPromotional: boolean;
  targetAudience: string;
  mandatoryRules: string;
  mediaSosialAturan: string;
  customInstruksiAwalWajib?: string;
}

export interface SlideOutputRevised {
  instruksi_awal_wajib: string;
  slideNumber: number;
  totalSlides: number;
  role: string;
  peran: string;
  instruksi: string;
  gaya_dominan: string;
  deskripsi_visual: string;
  negative_prompt: string;
  teks_dalam_gambar: {
    headline: string;
    subtext: string;
    detail: string;
    microTip: string;
    nomor_slide: string;
  };
  aturan_permanen: string;
  media_sosial_aturan: string;
  memori_visual_slide_sebelumnya?: any;
}

export const getStyleAttributes = (designStyleName: string, stylePromptText: string = ''): StyleDetail => {
  const name = designStyleName.toLowerCase();
  
  if (name.includes('infographic') || name.includes('infografis')) {
    return {
      gaya_dominan: "Product Lifestyle Photography dengan sentuhan Infographic Minimalist sebagai layer pendukung (rasio komposisi: 65% area foto produk lifestyle sebagai focal point utama, 35% area infographic minimalist untuk ruang teks/data di sekitar produk). JANGAN membuat gambar menjadi flat infographic penuh — produk harus tetap terlihat fotorealistik dan jadi pusat perhatian.",
      gaya_visual_wajib: "Premium editorial composition yang menggabungkan product photography dengan elemen infographic minimalist sebagai bingkai pendukung, terinspirasi dari Apple Keynote presentations, Stripe documentation, dan modern editorial layout. Hasil akhir harus terlihat seperti dikerjakan oleh senior art director profesional, bukan seperti AI-generated artwork generik.",
      layout_dan_hierarki: "Gunakan grid system yang terorganisir dengan margin konsisten, whitespace yang cukup, dan alur baca dari headline ke gambar produk ke detail pendukung. Sisakan area kosong yang jelas untuk headline, subtext, detail, dan microTip sesuai posisi yang ditentukan.",
      elemen_infografis_pendukung: "Tambahkan elemen infografis tipis dan halus sebagai dekorasi pendukung (bukan dominan): garis pembatas tipis, kartu statistik kecil, ikon flat monokrom/two-tone dengan stroke bersih, indikator lingkaran/persentase kecil di sudut. Elemen ini berfungsi sebagai aksen, bukan elemen utama.",
      palet_warna: "Warna dasar netral premium: Pure White (#FFFFFF), Off White (#FAFAFA), Light Gray (#F5F5F7), Warm White (#FCFCFC). Warna aksen terbatas: Deep Blue (#2563EB), Cyan (#06B6D4), Emerald Green (#10B981), Orange (#F59E0B), Charcoal (#374151). PENTING: warna aksen tidak boleh menutupi atau mengubah warna asli produk (tetap netral dan akurat).",
      tipografi: "Gunakan tipografi sans-serif modern bergaya Inter/SF Pro Display. Headline: bold, ukuran besar, kontras tinggi terhadap background. Subtext: regular weight, ukuran sedang. Detail & microTip: light/regular, ukuran kecil namun tetap terbaca jelas. Semua teks harus punya kontras warna cukup terhadap background agar mudah dibaca di layar mobile.",
      pencahayaan_dan_kamera: "Soft natural lighting dari arah kiri atas (golden hour tone hangat namun tetap clean), sudut kamera 45 derajat dengan shallow depth of field, produk diposisikan mengikuti rule of thirds sebagai focal point utama.",
      kedalaman_visual: "Bangun depth melalui spacing, layering, dan blur latar belakang alami (bokeh dari depth of field kamera), bukan melalui shadow dramatis, efek glossy, atau gradient berlebihan."
    };
  }

  if (name.includes('minimalist') || name.includes('minimalis')) {
    return {
      gaya_dominan: "Minimalist Studio Design yang sangat bersih dengan fokus utama pada produk (rasio komposisi: 70% area produk visual dengan ruang kosong luas, 30% area teks minimalis).",
      gaya_visual_wajib: "Ultra-minimalist modern graphic design, terinspirasi dari gaya majalah Kinfolk dan estetika brand premium minimalis. Sangat elegan, bersih, dan berkelas.",
      layout_dan_hierarki: "Asymmetric grid yang unik, margin super lebar, ruang bernafas (whitespace) yang sangat dominan untuk menonjolkan keindahan produk secara maksimal.",
      elemen_infografis_pendukung: "Ikon outline tipis satu warna, bullet point minimal berupa titik kecil, garis pembatas horizontal yang sangat tipis untuk menjaga kesederhanaan.",
      palet_warna: "Warna dasar netral premium: Matte Black (#111111), Pure White (#FFFFFF), Light Sand (#F3F2EE), Slate Gray (#6B7280). Warna aksen minimalis terbatas.",
      tipografi: "Gunakan tipografi sans-serif modern geometris bergaya Futura atau Inter. Headline: clean bold, ukuran besar. Detail: regular, ramping, dengan spacing teratur.",
      pencahayaan_dan_kamera: "Soft diffused natural light, bayangan lembut yang panjang, sudut kamera estetik dengan depth of field sangat dangkal (bokeh dramatis).",
      kedalaman_visual: "Menciptakan kedalaman melalui ruang kosong (negative space), bayangan natural yang lembut, dan penempatan layering produk yang elegan."
    };
  }

  if (name.includes('corporate') || name.includes('elegant') || name.includes('bisnis')) {
    return {
      gaya_dominan: "Professional Corporate Slide Design dengan perpaduan elemen bisnis minimalis (rasio komposisi: 60% area visual korporat/produk, 40% area infografis bersih untuk teks).",
      gaya_visual_wajib: "Premium editorial business design yang terstruktur rapi, terinspirasi dari McKinsey reports, Stripe design system, dan slide presentasi Apple Keynote. Terkesan profesional, bersih, dan mewah.",
      layout_dan_hierarki: "Struktur grid Swiss yang kaku, rapi, dan teratur. Whitespace luas, margin seimbang, penataan informasi yang efisien dan logis.",
      elemen_infografis_pendukung: "Garis tipis pembatas, diagram flat 2D minimalis, badge teks kecil, ikon bisnis monokrom bergaris tipis (thin-line icons).",
      palet_warna: "Warna dasar netral: Deep Navy Blue (#0F2D52), Charcoal Gray (#4B5563), Off-White (#FAFAFA). Warna aksen: Steel Blue (#3B82F6), Subtle Silver (#E5E7EB).",
      tipografi: "Sans-serif premium bergaya SF Pro Display / Helvetica Neue. Headline bold ukuran besar, subtext/detail teks rapi dan teratur dengan kontras tinggi.",
      pencahayaan_dan_kamera: "Clean studio lighting, pencahayaan merata dan netral, sudut kamera lurus (eye-level) atau top-down datar.",
      kedalaman_visual: "Menggunakan layering berlapis tipis, margin bersih, dan bayangan drop-shadow yang sangat halus (soft shadow)."
    };
  }

  if (name.includes('vibrant') || name.includes('bold') || name.includes('berani')) {
    return {
      gaya_dominan: "Vibrant High-Contrast Graphic Design dengan warna-warna berani dan layout dinamis (rasio komposisi: 60% elemen grafis ekspresif, 40% area teks kontras tinggi).",
      gaya_visual_wajib: "Bold modern media post design, bergaya pop-art modern dengan visual yang sangat mencolok dan dinamis untuk langsung menarik perhatian di feed media sosial.",
      layout_dan_hierarki: "Tata letak dinamis, asimetris, huruf headline yang menumpuk tebal, alur baca zig-zag yang energik dan menantang.",
      elemen_infografis_pendukung: "Bentuk geometris abstrak berwarna kontras, panah indikator tebal, badge warna neon, ikon dua dimensi yang solid dan tegas.",
      palet_warna: "Warna dasar kontras tinggi: Neon Blue (#00E5FF), Hot Pink (#FF007F), Bright Yellow (#FFD600), Charcoal (#121212).",
      tipografi: "Display font yang tebal dan ekstra bold (Montserrat Black / Impact). Headline sangat besar, subtext berwarna kontras tinggi.",
      pencahayaan_dan_kamera: "Bright direct studio lighting, kontras tinggi antara area terang dan gelap, saturasi warna tinggi.",
      kedalaman_visual: "Kedalaman visual dibangun dari tumpukan elemen datar berwarna kontras (overlapping flat shapes) dan bayangan tajam (hard shadow)."
    };
  }

  if (name.includes('playful') || name.includes('colorful') || name.includes('ceria')) {
    return {
      gaya_dominan: "Playful & Friendly Design dengan ilustrasi ceria 2D, cocok untuk audiens muda dan edukasi yang santai (rasio: 65% area ilustrasi visual, 35% area teks).",
      gaya_visual_wajib: "Gaya ilustratif kartun 2D yang ceria, hangat, ramah, dan penuh energi positif, menyerupai desain editorial modern untuk anak muda.",
      layout_dan_hierarki: "Tata letak yang santai, bentuk-bentuk melengkung organik (organic curves), susunan teks yang ramah dan dinamis.",
      elemen_infografis_pendukung: "Ikon lucu bergaya rounded, gelembung ucapan (speech bubbles), bentuk bintang/bunga dekoratif sederhana, bullet points berbentuk ikon imut.",
      palet_warna: "Warna-warni cerah yang hangat: Pastel Orange (#F59E0B), Soft Yellow (#FBBF24), Mint Green (#34D399), Sky Blue (#60A5FA), Soft Peach (#FCA5A5).",
      tipografi: "Tipografi sans-serif dengan sudut membulat (rounded) seperti Quicksand atau Nunito. Terasa bersahabat, hangat, dan sangat mudah dibaca.",
      pencahayaan_dan_kamera: "Bright warm ambient light, pencahayaan merata tanpa bayangan tajam, warna cerah dan mengundang.",
      kedalaman_visual: "Kedalaman minimalis dengan overlay bentuk melengkung yang tumpang tindih secara halus (soft overlapping layers) dan outline tipis."
    };
  }

  if (name.includes('retro') || name.includes('vintage') || name.includes('klasik')) {
    return {
      gaya_dominan: "Classic 90s Retro Aesthetic dengan tekstur organik dan gaya cetak lama (rasio: 60% visual ilustrasi bergaya retro, 40% area teks klasik).",
      gaya_visual_wajib: "Estetika klasik tahun 90-an (90s retro pop), tekstur kertas grain/grunge halus, gaya ilustrasi datar dengan outline vintage yang elegan.",
      layout_dan_hierarki: "Struktur layout majalah klasik, margin lebar dengan border luar ganda (double border), penempatan teks terpusat yang seimbang.",
      elemen_infografis_pendukung: "Garis dekoratif bergelombang, stiker gaya retro, ikon piksel atau monokrom jadul, bingkai kartu dengan drop-shadow hitam padat.",
      palet_warna: "Palet warna pastel pop hangat pudar: Warm Mustard (#D97706), Terracotta (#C2410C), Olive Green (#4D7C0F), Cream Beige (#FEF3C7), Vintage White (#FDFBF7).",
      tipografi: "Menggunakan font Serif klasik bergaya retro (Playfair Display / Merriweather). Headline: bold serif, anggun dan berkarakter. Subtext: sans-serif klasik.",
      pencahayaan_dan_kamera: "Warm analog film lighting dengan filter warm tone, bayangan pudar (faded shadow), menyerupai hasil foto kamera polaroid/roll film.",
      kedalaman_visual: "Dibangun melalui tekstur grain kertas, bayangan offset padat (hard offset shadow), dan layering elemen grafis gaya kolase cetak."
    };
  }

  if (name.includes('cyberpunk') || name.includes('futuristik')) {
    return {
      gaya_dominan: "Dark Cyberpunk Sci-Fi Design dengan latar belakang gelap gulita dan aksen neon menyala (rasio: 60% visual futuristik, 40% teks neon kontras).",
      gaya_visual_wajib: "Futuristik dark cyberpunk style, memadukan background hitam/abu-abu sangat gelap dengan aksen grafis neon yang berpendar tajam.",
      layout_dan_hierarki: "Tata letak asimetris yang futuristik, menggunakan panel-panel UI bergaya layar komputer canggih, teks dengan orientasi vertikal/horizontal kontras.",
      elemen_infografis_pendukung: "Garis grid teknologi (laser lines), HUD digital, hologram minimalis, indikator glosarium sains, barcode dekoratif.",
      palet_warna: "Latar belakang gelap: Matte Black (#08080C), Charcoal (#12131C). Aksen neon menyala: Electric Pink (#FF007F), Neon Cyan (#00F0FF), Acid Yellow (#CCFF00).",
      tipografi: "Font sans-serif modern bergaya futuristik/mono (JetBrains Mono / Space Grotesk). Teks headline besar dengan efek glow/glow tipis.",
      pencahayaan_dan_kamera: "High contrast neon backlighting, pencahayaan dramatis dari samping, pantulan cahaya neon pada objek utama.",
      kedalaman_visual: "Menciptakan kedalaman dengan efek overlay layer berpendar (glowing cards), kontras kegelapan latar dengan pendaran cahaya neon."
    };
  }

  if (name.includes('brutalist') || name.includes('neo-brutalist')) {
    return {
      gaya_dominan: "Neo-Brutalist Design dengan border hitam tebal, warna flat mentah, dan layout bertumpuk (rasio: 55% visual abstrak/produk, 45% teks bertumpuk).",
      gaya_visual_wajib: "Neo-brutalisme modern yang berani, menggunakan garis tepi hitam tebal dan tegas, warna solid mentah kontras tinggi, dan tata letak asimetris.",
      layout_dan_hierarki: "Grid mentah dengan garis pembatas hitam tebal (2-3px). Kotak teks diletakkan bertumpuk dengan bayangan offset padat tanpa blur.",
      elemen_infografis_pendukung: "Panah penunjuk tebal dengan border hitam, stiker datar, ikon flat yang sangat sederhana, box teks dengan drop shadow offset solid hitam.",
      palet_warna: "Warna datar mentah kontras tinggi: Bright Lemon (#FDE047), Mint Green (#4ADE80), Sky Cyan (#38BDF8), Hot Coral (#FB7185), Pure White (#FFFFFF) dengan border Matte Black (#000000).",
      tipografi: "Gunakan tipografi sans-serif tebal ekstrim bergaya Helvetica/Arial Black atau Archivo. Headline sangat dominan dan tegas.",
      pencahayaan_dan_kamera: "Flat 2D rendering, tidak ada bayangan 3D nyata atau pencahayaan kamera, semua elemen visual digambar sebagai objek datar.",
      kedalaman_visual: "Kedalaman visual disimulasikan murni menggunakan bayangan kotak offset solid (hard shadow offset) bergeser ke kanan bawah."
    };
  }

  if (name.includes('pastel') || name.includes('dream')) {
    return {
      gaya_dominan: "Dreamy Soft Pastel Design dengan gradasi warna halus dan bentuk bulat yang menenangkan (rasio: 65% visual produk/ilustrasi lembut, 35% teks).",
      gaya_visual_wajib: "Estetika pastel impian yang sangat lembut dan menenangkan, memadukan bentuk-bentuk geometris berujung bulat dengan gradasi warna transisi halus.",
      layout_dan_hierarki: "Tata letak yang harmonis, mengalir lembut, margin lebar dengan whitespace yang memberikan ketenangan visual.",
      elemen_infografis_pendukung: "Bentuk awan/bulat halus, ikon bergaris tipis dengan warna pastel senada, kartu berujung bulat (pill shapes), indikator persentase minimalis.",
      palet_warna: "Palet warna pastel lembut: Soft Lavender (#E9D5FF), Pale Pink (#FCE7F3), Mint Cream (#ECFDF5), Soft Cream (#FEF3C7), Sky Blue (#E0F2FE).",
      tipografi: "Gunakan tipografi sans-serif modern berbobot medium/regular seperti Outfit atau Nunito, memberikan kesan bersih dan damai.",
      pencahayaan_dan_kamera: "Super soft diffused light, pencahayaan alami yang lembut tanpa bayangan tegas, memberikan nuansa pagi hari yang berkabut halus.",
      kedalaman_visual: "Menggunakan gradasi warna latar belakang yang sangat halus, blur background ringan, dan bayangan tipis transparan (soft glow shadow)."
    };
  }

  if (name.includes('sketch') || name.includes('hand-drawn') || name.includes('doodle')) {
    return {
      gaya_dominan: "Artistic Hand-Drawn Doodle Design dengan garis tinta organik dan sapuan warna marker air (rasio: 60% visual sketsa organik, 40% area teks).",
      gaya_visual_wajib: "Ilustrasi sketsa tangan artistik (hand-drawn doodle art), menggunakan garis luar tinta hitam organik bergaya gambar tangan personal.",
      layout_dan_hierarki: "Tata letak bergaya jurnal seni (scrapbook/bullet journal), margin bebas, teks dan gambar disusun secara personal dan tidak kaku.",
      elemen_infografis_pendukung: "Panah yang digambar tangan, lingkaran penanda coretan, ikon doodle, garis bawah teks bergelombang buatan tangan.",
      palet_warna: "Warna dasar kertas alami: Paper Beige (#F5F5DC), Warm White (#FCFCFA). Sapuan warna air transparan: Soft Olive (#A3E635), Mustard Yellow (#FACC15), Pale Coral (#FCA5A5).",
      tipografi: "Gunakan tipografi menyerupai tulisan tangan yang kasual tapi rapi (handwriting font seperti Patrick Hand atau Caveat).",
      pencahayaan_dan_kamera: "Flat overhead lighting, menyerupai lembaran buku sketsa yang difoto dari atas di atas meja kerja.",
      kedalaman_visual: "Menciptakan depth melalui tumpukan sapuan warna marker semi-transparan di bawah garis sketsa hitam."
    };
  }

  if (name.includes('geometric') || name.includes('abstract')) {
    return {
      gaya_dominan: "Geometric Abstract Swiss Design dengan bentuk lingkaran, segitiga, dan grid presisi (rasio: 60% komposisi abstrak geometris, 40% teks grid).",
      gaya_visual_wajib: "Seni abstrak geometris klasik Swiss design style. Tata letak grid yang presisi tinggi dengan perpaduan bentuk geometris murni.",
      layout_dan_hierarki: "Grid system internasional yang sangat ketat, sejajar sempurna, penempatan headline dan subtext mengikuti koordinat grid.",
      elemen_infografis_pendukung: "Garis pembatas tebal solid, bentuk lingkaran/segitiga/persegi sebagai aksen layout, penanda poin berupa bentuk geometris kecil.",
      palet_warna: "Warna solid kontras tinggi: Crimson Red (#DC2626), Royal Blue (#1D4ED8), Mustard Yellow (#EAB308), Jet Black (#1A1A1A), Pure White (#FFFFFF).",
      tipografi: "Wajib menggunakan sans-serif netral legendaris (Helvetica / Arial / SF Pro Display) dengan bobot bold/heavy.",
      pencahayaan_dan_kamera: "Flat vector design, tidak ada pencahayaan studio atau bayangan 3D, semua bentuk murni datar 2D solid.",
      kedalaman_visual: "Kedalaman dibangun melalui penyusunan ukuran bentuk geometris (besar ke kecil) dan layering warna solid yang tumpang tindih secara presisi."
    };
  }

  if (name.includes('manga') || name.includes('comic') || name.includes('komik')) {
    return {
      gaya_dominan: "Japanese Manga Comic Style hitam putih dengan panel komik dan speed lines (rasio: 65% visual panel manga, 35% area teks dialog/poin).",
      gaya_visual_wajib: "Seni komik manga Jepang hitam putih tradisional, menggunakan tekstur dot halftone, panel komik tegas, dan garis luar tinta hitam tebal.",
      layout_dan_hierarki: "Pembagian panel komik dengan grid miring yang dinamis. Teks penting diletakkan di dalam balon teks komik atau kotak teks narasi.",
      elemen_infografis_pendukung: "Garis aksi (speed lines), balon teks dialog (speech bubbles), efek suara komik (onomatopoeia), bayangan halftone.",
      palet_warna: "Murni monokromatik hitam-putih: Deep Ink Black (#000000), Stark White (#FFFFFF) dengan variasi abu-abu berpola dot halftone.",
      tipografi: "Menggunakan font komik sans-serif ekspresif yang dinamis (seperti Comic Neue atau font manga Indonesia).",
      pencahayaan_dan_kamera: "High-contrast manga drawing, arsir garis (cross-hatching) untuk bayangan, tidak ada pencahayaan realistik.",
      kedalaman_visual: "Menciptakan kedalaman melalui perspektif panel yang dramatis, ketebalan garis tinta (line weight), dan bayangan arsir halftone."
    };
  }

  if (name.includes('sci-fi') || name.includes('hud') || name.includes('techno') || name.includes('circuit')) {
    return {
      gaya_dominan: "Techno Sci-Fi HUD Design dengan antarmuka sirkuit teknologi masa depan (rasio: 60% visual UI sains futuristik, 40% area teks digital).",
      gaya_visual_wajib: "Desain fiksi ilmiah bertema layar komputer sains (Sci-Fi HUD interface), dengan garis UI berpola sirkuit dan indikator data bercahaya.",
      layout_dan_hierarki: "Tata letak modular terstruktur seperti layar dasbor kontrol pesawat antariksa. Data dan teks dikelompokkan dalam kotak-kotak UI tipis.",
      elemen_infografis_pendukung: "Radar lingkaran, garis sirkuit teknologi, indikator panah digital, koordinat teks kecil, grafik frekuensi gelombang.",
      palet_warna: "Latar belakang gelap luar angkasa: Dark Space Blue (#020617), Tech Black (#090D1A). Indikator menyala: Laser Blue (#06B6D4), Cyan (#22D3EE), Lime Green (#84CC16).",
      tipografi: "Font monospace atau digital teknis bergaya minimal (JetBrains Mono / Share Tech Mono), memberikan kesan data komputer.",
      pencahayaan_dan_kamera: "Glowing display backlight, efek pendaran cahaya dari panel UI tipis di atas latar belakang gelap.",
      kedalaman_visual: "Menciptakan kedalaman dengan tumpukan grid semitransparan (semi-transparent grids) dan elemen HUD yang berlapis-lapis."
    };
  }

  if (name.includes('glassmorphism') || name.includes('glass')) {
    return {
      gaya_dominan: "Glassmorphism Design dengan kartu kaca transparan blur di atas gradien warna premium (rasio: 60% visual kartu kaca, 40% teks kontras).",
      gaya_visual_wajib: "Desain glassmorphism modern kelas atas, menampilkan efek kartu kaca buram transparan (frosted glass) yang elegan di atas background dinamis.",
      layout_dan_hierarki: "Penataan kartu melayang (floating cards) yang rapi secara vertikal atau horizontal, dengan headline berada di dalam kartu kaca utama.",
      elemen_infografis_pendukung: "Kartu kaca transparan dengan border putih sangat tipis, ikon flat bergaya dual-tone dengan transparansi, panah kaca transparan.",
      palet_warna: "Gradien latar belakang mewah: Royal Violet to Deep Emerald (#4C1D95 to #064E3B), Warm Gold to Copper (#78350F to #7C2D12). Kartu kaca: semi-transparan putih dengan blur tinggi.",
      tipografi: "Gunakan tipografi sans-serif modern premium seperti Inter atau Outfit. Teks di atas kaca harus memiliki kontras bayangan halus.",
      pencahayaan_dan_kamera: "Glossy frosted light reflection, pencahayaan studio lembut dengan highlight berkilau pada tepi-tepi kartu kaca.",
      kedalaman_visual: "Sangat kaya kedalaman melalui blur latar belakang (backdrop-filter blur), bayangan melayang (drop shadow lembut), dan border transparan."
    };
  }

  if (name.includes('nature') || name.includes('organic') || name.includes('botanical') || name.includes('alam')) {
    return {
      gaya_dominan: "Organic Botanical Design dengan warna bumi hangat dan sketsa tanaman alam yang tenang (rasio: 60% ilustrasi botani, 40% teks serif).",
      gaya_visual_wajib: "Desain organik berwawasan alam (botanical organic style), memadukan sketsa garis tanaman daun dan bunga yang anggun dengan warna bumi.",
      layout_dan_hierarki: "Tata letak yang tenang, asimetris alami, margin longgar, memberikan kesan bernafas dan dekat dengan alam.",
      elemen_infografis_pendukung: "Sketsa garis tanaman/daun halus, lingkaran tanah liat (terracotta shapes), ikon ramah lingkungan minimalis bergaris tipis.",
      palet_warna: "Warna bumi hangat (earthy tones): Terracotta (#C2410C), Olive Green (#3F6212), Mustard (#CA8A04), Sage Beige (#F5F5DC), Warm Clay (#EFEBE9).",
      tipografi: "Wajib menggunakan Serif klasik yang elegan dan artistik (seperti Playfair Display atau Lora) dikombinasikan dengan sans-serif ramping.",
      pencahayaan_dan_kamera: "Soft warm dappled light (efek bayangan dedaunan alami yang jatuh di atas kertas), nuansa sore hari yang hangat.",
      kedalaman_visual: "Menciptakan kedalaman dengan layering bayangan dedaunan tipis (dappled shadows) dan susunan sketsa botani di latar belakang."
    };
  }

  // Fallback for custom/other styles
  const cleanPromptText = stylePromptText ? stylePromptText.trim() : '';
  return {
    gaya_dominan: cleanPromptText || `${designStyleName} design style as focal point with professional slide placement.`,
    gaya_visual_wajib: cleanPromptText ? `Premium custom graphic design composition: ${cleanPromptText}` : `Professional custom design styling for ${designStyleName}.`,
    layout_dan_hierarki: "Gunakan grid system terorganisir dengan margin konsisten, whitespace yang cukup, dan alur baca teratur.",
    elemen_infografis_pendukung: "Tambahkan elemen visual pendukung yang tipis dan halus sebagai dekorasi pendukung.",
    palet_warna: `Palet warna disesuaikan dengan tema ${designStyleName}.`,
    tipografi: "Gunakan tipografi sans-serif modern yang bersih dan memiliki kontras warna cukup.",
    pencahayaan_dan_kamera: "Pencahayaan studio lembut (soft studio lighting) dengan sudut kamera estetik.",
    kedalaman_visual: "Menciptakan kedalaman visual melalui spacing, layering, dan bayangan natural yang sangat halus."
  };
};

export const formatSlideOutput = (params: SlideOutputParams): SlideOutputRevised => {
  const styleName = params.designStyleName.split('|')[0].trim();
  const styleAttributes = getStyleAttributes(styleName, params.stylePromptText);
  
  const instruksiAwalWajib = params.customInstruksiAwalWajib || `PERINTAH UTAMA UNTUK AI IMAGE GENERATOR: Sebelum membuat gambar, lakukan analisis internal terhadap seluruh isi prompt ini (deskripsi_visual, objek, layout, teks, warna, komposisi) dan bandingkan dengan pola/hasil yang biasa kamu buat untuk slide-slide lain dalam satu rangkaian carousel ini (slide 1 sampai ${params.totalSlides}). Jika ditemukan potensi kesamaan/duplikasi tinggi pada: sudut kamera, pose objek, posisi elemen infografis, kombinasi warna aksen, atau layout ikon dengan slide sebelumnya — WAJIB melakukan variasi kreatif (ubah angle, ubah komposisi framing, ubah posisi blok infografis, atau ubah kombinasi ikon pendukung) SELAMA tetap konsisten dengan sistem desain utama (font, palet warna dasar, gaya ${styleName.toLowerCase()}, posisi elemen wajib seperti nomor slide/footer/CTA). Tujuannya: setiap slide harus terasa unik secara visual namun tetap satu kesatuan sistem desain yang koheren sebagai satu carousel.`;

  return {
    instruksi_awal_wajib: instruksiAwalWajib,
    slideNumber: params.slideNumber,
    totalSlides: params.totalSlides,
    role: params.role,
    peran: "Kamu adalah Senior Graphic Designer & Art Director yang mengetahui kombinasi warna, tipografi, dan estetika visual premium.",
    instruksi: "Buatkan saya gambar baru dengan deskripsi berikut, pastikan hasilnya berbeda secara komposisi dari slide lain dalam carousel ini:",
    gaya_dominan: styleAttributes.gaya_dominan,
    deskripsi_visual: `[GAYA VISUAL WAJIB]: ${styleAttributes.gaya_visual_wajib}
[TATA LETAK & HIERARKI]: ${styleAttributes.layout_dan_hierarki}
[ELEMEN PENDUKUNG]: ${styleAttributes.elemen_infografis_pendukung}
[PALET WARNA]: ${styleAttributes.palet_warna}
[TIPOGRAFI]: ${styleAttributes.tipografi}
[PENCAHAYAAN & KAMERA]: ${styleAttributes.pencahayaan_dan_kamera}
[OBJEK & KONTEKS]: ${params.visualContent}
[KEDALAMAN VISUAL]: ${styleAttributes.kedalaman_visual}
[DIMENSI CANVAS]: Canvas ${params.orientationSpec.widthHint}px, Aspect Ratio ${params.orientationSpec.ratio} (--ar ${params.orientationSpec.ratio})`,
    negative_prompt: params.negativePrompt,
    teks_dalam_gambar: {
      headline: params.headline,
      subtext: params.subtext,
      detail: params.detail,
      microTip: params.microTip,
      nomor_slide: `${params.slideNumber} dari ${params.totalSlides}`
    },
    aturan_permanen: `${params.mandatoryRules.trim()}\nTarget Audiens: ${params.targetAudience}`,
    media_sosial_aturan: params.mediaSosialAturan
  };
};

export const getStylePromptText = async (designStyle: string): Promise<string> => {
  if (!designStyle) return '';
  const styleName = designStyle.split('|')[0].trim();
  try {
    // 1. Try to search design_styles case-insensitively & with partial matches
    const styleRows = await query(
      `SELECT prompt FROM design_styles 
       WHERE LOWER(name) = LOWER(?) OR id = ? OR LOWER(name) LIKE ? OR ? LIKE LOWER(CONCAT('%', name, '%')) 
       LIMIT 1`,
      [styleName.toLowerCase(), styleName, `%${styleName.toLowerCase()}%`, styleName.toLowerCase()]
    );
    if (styleRows.rows && styleRows.rows.length > 0) {
      return styleRows.rows[0].prompt || '';
    }

    // 2. Try to search themes case-insensitively & with partial matches
    const themeRows = await query(
      `SELECT prompt FROM themes 
       WHERE LOWER(name) = LOWER(?) OR id = ? OR LOWER(name) LIKE ? OR ? LIKE LOWER(CONCAT('%', name, '%')) 
       LIMIT 1`,
      [styleName.toLowerCase(), styleName, `%${styleName.toLowerCase()}%`, styleName.toLowerCase()]
    );
    if (themeRows.rows && themeRows.rows.length > 0) {
      return themeRows.rows[0].prompt || '';
    }
  } catch (err) {
    console.warn('Error fetching style/theme prompt from DB in getStylePromptText:', err);
  }
  return '';
};

