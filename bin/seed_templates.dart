import 'package:promting_app/core/database/database_service.dart';
import 'package:uuid/uuid.dart';
import 'package:promting_app/core/config/app_config_service.dart';

Future<void> main() async {
  print('Starting template seeding...');

  try {
    final db = DatabaseService.instance;

    // Wait to ensure db connects
    await Future.delayed(const Duration(seconds: 2));
    
    final uuid = const Uuid();

    // Check if category exists
    var checkCats = await db.execute('SELECT id FROM categories LIMIT 1');
    String catId;
    if (checkCats.isEmpty) {
      catId = uuid.v4();
      await db.execute(
        '''
        INSERT INTO categories (id, name, slug, icon, color, "createdAt", "updatedAt") 
        VALUES (\$1, 'Bisnis & Pitching', 'bisnis-pitching', '💼', '#FF9800', NOW(), NOW())
        ''',
        [catId]
      );
    } else {
      catId = checkCats.first[0] as String;
    }

    final templates = [
      {
        'title': 'Pitch Deck Startup 10 Slide',
        'description': 'Template pitch deck startup standar Silicon Valley untuk menarik investor. Berisi kerangka dari Problem, Solution, hingga Financial Projections.',
        'content': '''--- Slide 1 ---
[Cover] Judul Startup Anda - Pitch Deck
- Tagline yang kuat dan mudah diingat.
- Nama presenter/CEO.
- Visual: Latar belakang minimalis atau foto produk abstrak.

--- Slide 2 ---
[The Problem] Masalah yang Ingin Diselesaikan
- Deskripsikan masalah utama yang dialami target pasar Anda.
- Validasi masalah dengan statistik singkat.
- Visual: Ikon atau grafik yang menunjukkan besarnya masalah.

--- Slide 3 ---
[The Solution] Solusi yang Ditawarkan
- Bagaimana produk/jasa Anda menyelesaikan masalah tersebut.
- Value Proposition utama.
- Visual: Mockup produk sederhana.

--- Slide 4 ---
[Market Size] Potensi Pasar
- TAM, SAM, SOM.
- Karakteristik demografis pasar.
- Visual: Diagram lingkaran atau piramida.

--- Slide 5 ---
[Business Model] Model Bisnis
- Cara Anda menghasilkan uang.
- Struktur harga.
- Visual: Diagram alur sederhana.

--- Slide 6 ---
[Traction] Traksi dan Pertumbuhan
- Metrik kunci (pengguna aktif, pendapatan, dll).
- Milestone yang sudah dicapai.
- Visual: Grafik garis tren yang menaik.

--- Slide 7 ---
[Competition] Kompetisi dan Keunggulan
- Peta persaingan.
- Keunggulan kompetitif (Unfair Advantage).
- Visual: Kuadran kompetisi atau tabel perbandingan.

--- Slide 8 ---
[Go-to-Market Strategy] Strategi Pemasaran
- Saluran akuisisi pengguna.
- Rencana pemasaran jangka pendek.
- Visual: Funnel marketing.

--- Slide 9 ---
[The Team] Tim Inti
- Profil pendiri dan anggota kunci.
- Pengalaman yang relevan.
- Visual: Foto tim profesional.

--- Slide 10 ---
[Financials & Ask] Kebutuhan Dana
- Proyeksi keuangan 3-5 tahun.
- Jumlah pendanaan yang dicari dan alokasinya.
- Penutup dan kontak.
- Visual: Grafik batang dan rincian alokasi dana.''',
        'thumbnailUrl': 'https://ik.imagekit.io/yulian123/promptstudio/templates/pitchdeck_sample.jpg',
      },
      {
        'title': 'Proposal Kerjasama B2B',
        'description': 'Struktur proposal B2B yang profesional dan berorientasi pada nilai tambah untuk calon mitra bisnis.',
        'content': '''--- Slide 1 ---
[Cover] Proposal Kerjasama: [Nama Perusahaan Anda] & [Nama Mitra]
- Tanggal dan nama presenter.
- Visual: Logo kedua perusahaan bersandingan dengan gaya profesional.

--- Slide 2 ---
[Executive Summary] Ringkasan Eksekutif
- Gambaran singkat tentang peluang kerjasama.
- Manfaat utama bagi kedua belah pihak.

--- Slide 3 ---
[Company Profile] Tentang Kami
- Latar belakang perusahaan.
- Pencapaian dan keahlian inti.

--- Slide 4 ---
[The Opportunity] Peluang Sinergi
- Titik temu antara kekuatan kedua perusahaan.
- Analisis singkat peluang pasar.

--- Slide 5 ---
[Proposed Collaboration] Bentuk Kerjasama
- Detail teknis kerjasama yang diusulkan.
- Tanggung jawab masing-masing pihak.

--- Slide 6 ---
[Value Proposition] Manfaat untuk Mitra
- Keuntungan finansial dan non-finansial spesifik bagi mitra.
- ROI (Return on Investment) yang diharapkan.

--- Slide 7 ---
[Case Studies/Testimonials] Rekam Jejak
- Contoh kesuksesan kerjasama sebelumnya.
- Testimoni klien/mitra lain.

--- Slide 8 ---
[Implementation Plan] Rencana Implementasi
- Timeline/jadwal eksekusi.
- Fase dan milestone utama.

--- Slide 9 ---
[Financial/Resource Commitment] Komitmen Sumber Daya
- Perkiraan biaya atau investasi yang diperlukan.
- Alokasi sumber daya manusia.

--- Slide 10 ---
[Next Steps] Langkah Selanjutnya
- Call to Action yang jelas.
- Informasi kontak dan diskusi lanjutan.''',
        'thumbnailUrl': 'https://ik.imagekit.io/yulian123/promptstudio/templates/b2b_proposal.jpg',
      },
      {
        'title': 'Laporan Kinerja Kuartalan',
        'description': 'Template laporan kuartalan (QBR) yang jelas dan berbasis data untuk disajikan kepada manajemen atau dewan direksi.',
        'content': '''--- Slide 1 ---
[Cover] Laporan Kinerja Kuartal [X] Tahun [YYYY]
- Nama departemen/tim.
- Visual: Elemen desain korporat yang bersih.

--- Slide 2 ---
[Quarter Highlights] Sorotan Utama
- 3-5 pencapaian terbesar kuartal ini.
- Visual: Ikon dan teks besar untuk penekanan.

--- Slide 3 ---
[Key Metrics] Metrik Utama
- Perbandingan metrik target vs aktual.
- Visual: Dashboard atau grafik batang sederhana.

--- Slide 4 ---
[Financial Overview] Tinjauan Keuangan
- Pendapatan, pengeluaran, dan margin.
- Visual: Grafik air terjun (waterfall chart).

--- Slide 5 ---
[Operational Updates] Update Operasional
- Proyek utama yang diselesaikan.
- Perbaikan proses atau efisiensi baru.

--- Slide 6 ---
[Challenges & Roadblocks] Tantangan
- Hambatan utama yang dihadapi.
- Pelajaran yang dipetik.

--- Slide 7 ---
[Solutions Implemented] Solusi
- Tindakan korektif yang telah diambil.
- Hasil awal dari solusi tersebut.

--- Slide 8 ---
[Goals for Next Quarter] Target Kuartal Depan
- OKR atau KPI utama untuk kuartal berikutnya.
- Fokus strategis.

--- Slide 9 ---
[Resource Needs] Kebutuhan Sumber Daya
- Permintaan anggaran tambahan atau penambahan personel (jika ada).
- Justifikasi singkat.

--- Slide 10 ---
[Q&A] Sesi Tanya Jawab
- Ucapan terima kasih.
- Visual: Latar belakang kosong yang tenang untuk fokus pada diskusi.''',
        'thumbnailUrl': 'https://ik.imagekit.io/yulian123/promptstudio/templates/qbr_report.jpg',
      }
    ];

    for (final t in templates) {
      final tId = uuid.v4();
      await db.execute(
        '''
        INSERT INTO templates (id, title, description, content, "thumbnailUrl", "categoryId", "isPremium", "usageCount", "createdAt", "updatedAt")
        VALUES (\$1, \$2, \$3, \$4, \$5, \$6, false, 0, NOW(), NOW())
        ''',
        [
          tId,
          t['title'],
          t['description'],
          t['content'],
          t['thumbnailUrl'],
          catId
        ]
      );
      final title = t['title'];
      print('Inserted: $title');
    }

    print('Seeding completed successfully!');
  } catch (e) {
    print('Error seeding templates: $e');
  }
}
