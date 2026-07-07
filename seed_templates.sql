-- Seed Templates SQL
-- Target Database: MySQL (rdsmahat_apk)

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t1-feynman-technique', 'Feynman Technique Simplifier', 'Sederhanakan konsep akademis atau teknis yang rumit menggunakan analogi sehari-hari dan bahasa yang mudah dipahami anak kecil.', '--- Slide 1 ---
Saya ingin mempelajari konsep tentang [Konsep/Topik]. Tolong jelaskan konsep ini menggunakan Metode Feynman. Pertama, jelaskan seolah-olah Anda sedang menerangkannya kepada anak berusia 10 tahun. Gunakan bahasa yang sangat sederhana, hindari jargon teknis, dan sertakan analogi kehidupan nyata yang relevan.

--- Slide 2 ---
Berdasarkan penjelasan di atas, identifikasi bagian mana dari konsep [Konsep/Topik] yang paling sering disalahpahami orang. Berikan penjelasan tambahan yang mengklarifikasi kesalahpahaman tersebut tanpa kehilangan kesederhanaan penjelasan.

--- Slide 3 ---
Terakhir, buatlah ringkasan singkat dalam bentuk 3 poin utama yang mencakup:
1. Apa masalah utama yang diselesaikan oleh konsep ini?
2. Bagaimana cara kerjanya secara mendasar?
3. Apa manfaat atau dampaknya bagi dunia nyata?', NULL, '1', false, 154)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t2-socratic-coding', 'Socratic Coding Tutor', 'Belajar pemrograman secara interaktif melalui pertanyaan panduan alih-alih langsung diberi tahu jawabannya.', '--- Slide 1 ---
Saya ingin belajar tentang [Topik Pemrograman/Bahasa/Algoritma] menggunakan Metode Sokrates. Jangan langsung memberikan kode solusi atau jawaban lengkap kepada saya. Sebaliknya, mulailah dengan menanyakan satu pertanyaan panduan yang menantang pemikiran saya tentang dasar topik ini.

--- Slide 2 ---
Setelah saya menjawab pertanyaan Anda sebelumnya, berikan umpan balik singkat mengenai pemahaman saya. Jika jawaban saya kurang tepat, bantu saya mengoreksinya dengan pertanyaan petunjuk lain. Jika jawaban saya benar, ajukan pertanyaan berikutnya yang tingkat kesulitannya setingkat lebih tinggi.

--- Slide 3 ---
Di akhir sesi, setelah kita menyelesaikan konsep ini, berikan rangkuman tentang apa yang telah saya pelajari beserta satu latihan praktis kecil yang bisa saya coba sendiri di editor kode saya.', NULL, '1', true, 89)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t3-language-coach', 'Language Immersion Coach', 'Latihan percakapan bahasa asing interaktif dengan koreksi tata bahasa langsung di setiap tanggapan.', '--- Slide 1 ---
Bertindaklah sebagai Pelatih Bahasa [Bahasa Target] saya. Kita akan melakukan percakapan santai tentang tema [Topik Percakapan]. Gunakan tingkat kemahiran [Pemula/Menengah/Mahir]. Setiap kali Anda merespons, mulailah dengan membetulkan kesalahan tata bahasa atau pilihan kata dari pesan saya sebelumnya (jika ada), lalu lanjutkan percakapan.

--- Slide 2 ---
Sekarang, mari kita ubah skenario percakapan kita menjadi situasi bermain peran (roleplay) di [Tempat, misal: Restoran/Bandara]. Anda berperan sebagai [Peran AI, misal: Pelayan/Petugas Bandara] dan saya sebagai pelanggan. Berikan respons pertama Anda untuk memulai roleplay ini.

--- Slide 3 ---
Setelah percakapan selesai, berikan laporan evaluasi singkat tentang tata bahasa saya, kosakata baru yang sebaiknya saya pelajari untuk topik ini, dan berikan skor 1-10 untuk kemampuan komunikasi saya.', NULL, '1', false, 120)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t4-anki-flashcard', 'Anki Flashcard Generator', 'Ubah materi belajar atau artikel menjadi kartu flashcard berkualitas tinggi untuk sistem Anki.', '--- Slide 1 ---
Berikut adalah teks materi belajar saya tentang [Topik/Materi]:
"[Masukkan Teks Materi Di Sini]"

Tolong buatkan daftar kartu flashcard (Anki) berdasarkan teks di atas. Gunakan metode active recall. Format output harus berupa tabel dua kolom: Kolom 1 adalah "Pertanyaan (Front)" dan Kolom 2 adalah "Jawaban (Back)". Fokus pada poin-poin krusial yang mudah diingat.

--- Slide 2 ---
Sekarang, buat versi kartu flashcard menggunakan metode "Cloze Deletion" (mengisi bagian yang kosong) untuk poin-poin penting yang membutuhkan hafalan kata kunci atau angka spesifik dari teks tersebut. Format penulisan harus berupa format bawaan Anki: {{c1::kata_kunci}}.

--- Slide 3 ---
Berikan tips memori singkat atau jembatan keledai (mnemonik) untuk 3 konsep tersulit yang ada di dalam materi belajar tersebut agar saya lebih mudah menghafalnya.', NULL, '1', false, 210)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t5-paper-summarizer', 'Scientific Paper Summarizer', 'Ekstrak metodologi, temuan kunci, dan keterbatasan dari artikel ilmiah dengan cepat.', '--- Slide 1 ---
Tolong buat ringkasan eksekutif dari jurnal ilmiah dengan judul/abstrak berikut:
"[Masukkan Judul/Abstrak/Teks Jurnal Di Sini]"

Ringkasan harus terstruktur menjadi 3 bagian:
1. **Latar Belakang & Masalah**: Mengapa penelitian ini dilakukan?
2. **Metodologi**: Bagaimana para peneliti melakukan eksperimen atau studinya?
3. **Temuan Utama**: Apa hasil paling signifikan yang didapatkan?

--- Slide 2 ---
Jelaskan apa saja keterbatasan (limitations) yang disebutkan dalam penelitian ini, dan apa implikasi dari temuan penelitian ini terhadap bidang akademis maupun aplikasi praktis di industri nyata.

--- Slide 3 ---
Buatlah ringkasan satu kalimat yang sangat padat (one-sentence pitch) yang menjelaskan seluruh esensi dari jurnal ilmiah ini agar mudah dijelaskan kepada orang awam dalam waktu kurang dari 10 detik.', NULL, '1', true, 312)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t6-study-planner', 'Exam Prep Study Plan Creator', 'Buat jadwal belajar terstruktur dan realistis untuk menghadapi ujian penting dalam 30 hari.', '--- Slide 1 ---
Saya akan menghadapi ujian [Nama Ujian, misal: UTBK/IELTS/Sertifikasi AWS] dalam waktu [Jumlah Hari, misal: 30] hari. Topik-topik utama yang diujikan adalah: [Sebutkan Topik-Topik Utama]. Tolong buatkan rencana belajar mingguan yang terstruktur. Tentukan target pembelajaran untuk setiap minggu beserta estimasi waktu belajar per hari.

--- Slide 2 ---
Berdasarkan rencana mingguan tersebut, buatkan jadwal harian detail untuk Minggu Pertama. Sertakan waktu untuk istirahat (menggunakan metode Pomodoro), sesi latihan soal, dan sesi evaluasi kesalahan.

--- Slide 3 ---
Berikan rekomendasi strategi menjawab soal ujian yang efektif untuk tipe ujian [Nama Ujian], termasuk bagaimana cara mengelola waktu pengerjaan soal dan tips mengatasi kecemasan sebelum ujian.', NULL, '1', false, 145)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t7-cold-email', 'Cold Email Copywriter', 'Tulis email prospek bisnis yang persuasif dengan tingkat respons tinggi untuk produk/layanan Anda.', '--- Slide 1 ---
Tulis email prospek (cold email) bisnis yang singkat dan persuasif untuk menawarkan produk/layanan: [Nama Produk/Jasa Anda] kepada target audiens: [Target Jabatan/Bisnis, misal: CEO Startup Teknologi]. Tujuan email ini adalah agar penerima tertarik menjadwalkan demo singkat 10 menit. Pastikan email memiliki subjek yang menarik minat baca, tidak terdengar seperti spam, dan memiliki Call to Action (CTA) yang jelas.

--- Slide 2 ---
Sekarang buat 2 variasi baris subjek (subject line) tambahan yang memicu rasa ingin tahu (curiosity hook) atau menyoroti masalah utama industri mereka (pain point hook).

--- Slide 3 ---
Tulis template email tindak lanjut (follow-up email) pertama yang dikirimkan 3 hari setelah email pertama jika tidak ada respons. Email follow-up ini harus singkat, memberikan satu nilai tambah (value add), dan tidak menuntut.', NULL, '2', false, 423)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t8-elevator-pitch', 'Pitch Deck Elevator Pitch', 'Buat narasi elevator pitch singkat namun memikat untuk dipresentasikan di depan calon investor.', '--- Slide 1 ---
Saya sedang membangun startup bernama [Nama Startup] yang bergerak di bidang [Industri/Niche]. Startup kami memecahkan masalah [Masalah yang Diselesaikan] bagi target pengguna [Siapa Penggunanya]. Solusi yang kami tawarkan adalah [Solusi Unik Anda]. Tolong buatkan Elevator Pitch berdurasi 60 detik yang menarik, percaya diri, dan memiliki struktur hook-masalah-solusi-dampak.

--- Slide 2 ---
Buat versi super ringkas dari pitch tersebut (30 detik / sekitar 2 kalimat) yang bisa saya gunakan saat berkenalan secara cepat di acara jejaring bisnis (networking event).

--- Slide 3 ---
Sebutkan 3 pertanyaan kritis yang paling mungkin diajukan oleh investor setelah mendengar elevator pitch ini, beserta cara terbaik dan paling taktis bagi saya untuk menjawabnya.', NULL, '2', true, 198)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t9-swot-analysis', 'SWOT Analysis Strategist', 'Analisis kekuatan, kelemahan, peluang, dan ancaman untuk ide bisnis atau produk baru Anda.', '--- Slide 1 ---
Tolong lakukan analisis SWOT (Strengths, Weaknesses, Opportunities, Threats) yang mendalam untuk ide bisnis berikut:
"[Deskripsikan Ide Bisnis/Produk Anda secara Detail]"

Sajikan hasil analisis dalam bentuk poin-poin terstruktur untuk masing-masing dari 4 elemen SWOT tersebut secara spesifik.

--- Slide 2 ---
Berdasarkan hasil SWOT di atas, buatlah analisis matriks TOWS untuk menghasilkan strategi taktis:
1. **Strategi SO**: Bagaimana kekuatan kita bisa memanfaatkan peluang eksternal?
2. **Strategi WO**: Bagaimana kita mengatasi kelemahan internal dengan memanfaatkan peluang?
3. **Strategi ST**: Bagaimana kekuatan kita meminimalkan dampak ancaman eksternal?
4. **Strategi WT**: Bagaimana kita meminimalkan kelemahan dan menghindari ancaman?

--- Slide 3 ---
Rangkum hasil analisis ini menjadi 3 langkah aksi (action items) paling mendesak yang harus segera dilakukan untuk memulai validasi ide bisnis ini.', NULL, '2', false, 231)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t10-product-launch', 'Product Launch GTM Plan', 'Rancang strategi Go-To-Market (GTM) terperinci untuk peluncuran produk baru Anda.', '--- Slide 1 ---
Saya akan meluncurkan produk baru yaitu [Nama & Deskripsi Singkat Produk] untuk pasar [Target Audiens/Negara]. Tolong buatkan draf rencana strategi peluncuran produk (Go-To-Market Plan) yang mencakup 3 fase: Pra-Peluncuran (Pre-Launch), Hari Peluncuran (Launch Day), dan Pasca-Peluncuran (Post-Launch).

--- Slide 2 ---
Tentukan taktik pemasaran digital (marketing channels) terbaik untuk peluncuran ini (misalnya media sosial, email marketing, kolaborasi influencer, atau iklan berbayar) beserta contoh ide konten utama untuk masing-masing saluran pemasaran tersebut.

--- Slide 3 ---
Buatlah daftar KPI (Key Performance Indicators) utama yang wajib kami ukur untuk menentukan apakah kampanye peluncuran produk ini sukses atau gagal secara finansial maupun branding.', NULL, '2', true, 156)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t11-customer-persona', 'Customer Persona Creator', 'Buat profil pembeli ideal (buyer persona) yang mendalam untuk mengoptimalkan strategi marketing.', '--- Slide 1 ---
Buatkan profil persona pelanggan ideal (buyer persona) untuk bisnis saya yang menjual [Nama Produk/Layanan] ke target audiens [Deskripsi Singkat Target, misal: Pemilik bisnis lokal / Ibu muda pekerja]. Berikan dia nama fiktif, rentang usia, pekerjaan, tingkat pendapatan, serta jelaskan demografi dasarnya.

--- Slide 2 ---
Uraikan secara detail apa saja tujuan utama mereka (Goals), tantangan terbesar/masalah yang mereka hadapi sehari-hari (Pain Points), serta apa yang memotivasi mereka dalam mengambil keputusan pembelian produk.

--- Slide 3 ---
Berikan rekomendasi pesan pemasaran (marketing message hook) yang paling cocok digunakan dalam materi promosi iklan agar langsung menyentuh emosi persona ini dan memotivasi mereka untuk membeli.', NULL, '2', false, 342)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t12-saas-pricing', 'SAAS Pricing Optimizer', 'Rancang skema harga langganan produk digital Anda agar kompetitif dan memaksimalkan pendapatan.', '--- Slide 1 ---
Bantu saya menyusun skema harga (pricing model) untuk produk SaaS (Software as a Service) saya yang berupa: [Deskripsi Singkat SaaS & Solusinya]. Target audiens kami adalah [Audiens, misal: Freelancer dan Agensi Kecil]. Buatkan 3 tingkatan paket harga standar: Paket Pemula (Starter), Paket Terpopuler (Growth), dan Paket Perusahaan (Enterprise). Tentukan fitur apa saja yang masuk ke masing-masing paket.

--- Slide 2 ---
Berikan analisis mengenai strategi penentuan harga yang Anda usulkan tadi. Mengapa pembagian fitur tersebut efektif? Bagaimana psikologi harga (seperti anchoring atau decoy effect) diterapkan dalam struktur ini?

--- Slide 3 ---
Tulis salinan kalimat pemasaran singkat (value copy) untuk dipajang di halaman website pricing page guna meyakinkan pengunjung agar memilih paket ''Growth''.', NULL, '2', true, 187)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t13-seo-brief', 'SEO Content Brief Planner', 'Buat outline artikel blog yang teroptimasi SEO berdasarkan kata kunci target Anda.', '--- Slide 1 ---
Saya ingin menulis artikel blog dengan kata kunci target (target keyword): "[Kata Kunci Anda, misal: tips investasi kripto pemula]". Tolong buatkan perencanaan konten SEO (SEO Content Brief) yang mencakup: usulan Judul Artikel yang menarik (Title Tag), deskripsi penelusuran (Meta Description), dan analisis maksud pencarian pembaca (Search Intent).

--- Slide 2 ---
Buatkan outline struktur artikel lengkap dari H1, H2, hingga H3. Pastikan outline ini ramah SEO, mengalir secara logis untuk pembaca, dan menjawab semua pertanyaan umum yang dicari audiens mengenai kata kunci tersebut.

--- Slide 3 ---
Berikan panduan optimasi konten tambahan, termasuk daftar kata kunci turunan (LSI Keywords) yang sebaiknya disisipkan di dalam artikel, serta ide tautan internal (internal linking strategy) dan saran CTA (Call to Action) di akhir artikel.', NULL, '2', false, 298)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t14-meal-planner', 'Meal & Nutrition Planner', 'Rancang rencana menu makanan mingguan yang sehat dan sesuai dengan target kalori Anda.', '--- Slide 1 ---
Tolong buatkan rencana menu makanan sehat mingguan (7 hari) untuk saya yang memiliki target: [Target Anda, misal: Menurunkan berat badan / Membangun massa otot]. Saya memiliki kebutuhan kalori harian sekitar [Jumlah Kalori, misal: 1800] kkal dengan diet tipe [Tipe Diet, misal: Tinggi Protein/Halal/Vegan/Keto]. Susun menu lengkap dari Sarapan, Makan Siang, Camilan, dan Makan Malam.

--- Slide 2 ---
Berdasarkan rencana makan 7 hari di atas, buatkan daftar belanja bahan makanan mingguan (grocery shopping list) yang dikelompokkan berdasarkan kategori (seperti sayuran, protein, karbohidrat, dll) agar belanja lebih efisien.

--- Slide 3 ---
Berikan tips persiapan makan (meal prep hacks) berdurasi singkat untuk hari Minggu agar saya dapat menyiapkan bahan makanan tersebut dengan cepat dan menjaga kesegarannya sepanjang minggu.', NULL, '3', false, 389)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t15-home-workout', 'Home Workout Generator', 'Buat rutinitas latihan fisik tanpa alat di rumah yang disesuaikan dengan tingkat kebugaran Anda.', '--- Slide 1 ---
Saya ingin rutinitas latihan fisik di rumah (home workout) tanpa menggunakan alat gym (bodyweight exercises). Tingkat kebugaran saya adalah [Pemula/Menengah/Mahir]. Target utama saya adalah [Tujuan, misal: Membakar lemak / Meningkatkan stamina]. Tolong rancang jadwal latihan mingguan yang terdiri dari latihan 3-4 hari dalam seminggu dengan durasi latihan per sesi 30-45 menit.

--- Slide 2 ---
Berikan detail gerakan untuk Rutinitas Hari Pertama (misal: Latihan Seluruh Tubuh / Full Body Workout). Cantumkan nama gerakan, jumlah set, repetisi, serta waktu istirahat antar-set. Sertakan juga panduan singkat pemanasan (warm-up) dan pendinginan (cool-down).

--- Slide 3 ---
Berikan panduan cara melakukan progresi latihan (progressive overload) menggunakan berat badan sendiri agar latihan saya tetap menantang seiring waktu saat stamina saya meningkat.', NULL, '3', false, 265)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t16-meditation-guide', 'Mindfulness & Meditation Guide', 'Panduan meditasi pernapasan terpandu untuk mengurangi kecemasan dan melatih fokus pikiran.', '--- Slide 1 ---
Saya merasa sedang stres/cemas karena [Sebab Stres, misal: pekerjaan menumpuk] dan butuh waktu untuk menenangkan pikiran. Tolong pandu saya melakukan latihan pernapasan mindfulness singkat selama 5 menit. Berikan instruksi langkah-demi-langkah (seperti metode Box Breathing atau 4-7-8) yang bisa saya ikuti saat membaca ini.

--- Slide 2 ---
Tulis naskah pendek untuk meditasi terpandu (guided meditation) dengan tema "Menolak Kebisingan Pikiran". Naskah ini harus ditulis dengan gaya bahasa yang menenangkan, lambat, dan berfokus pada kesadaran tubuh (body scan).

--- Slide 3 ---
Berikan 3 kebiasaan mindfulness sederhana (micro-habits) yang bisa saya terapkan di sela-sela jam kerja sibuk untuk menjaga kesehatan mental dan emosional saya setiap hari.', NULL, '3', true, 143)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t17-sleep-coach', 'Sleep Hygiene Coach', 'Analisis kebiasaan tidur Anda dan dapatkan tips praktis untuk mengatasi insomnia.', '--- Slide 1 ---
Saya sering mengalami kesulitan tidur atau merasa lelah saat bangun di pagi hari. Rutinitas malam saya saat ini adalah: [Deskripsikan rutinitas Anda sebelum tidur, misal: main HP di kasur, minum kopi jam 5 sore, dll]. Tolong analisis kebiasaan buruk saya yang mengganggu kualitas tidur berdasarkan konsep Sleep Hygiene.

--- Slide 2 ---
Buatkan rencana rutinitas malam hari yang ideal (wind-down routine) selama 1 jam sebelum tidur untuk mempersiapkan tubuh saya agar rileks dan siap tidur nyenyak.

--- Slide 3 ---
Sebutkan 3 perubahan lingkungan kamar tidur (seperti pencahayaan, suhu, atau suara) yang secara sains terbukti paling efektif membantu seseorang tertidur lebih cepat dan tidur lebih dalam (deep sleep).', NULL, '3', false, 198)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t18-ergonomic-desk', 'Ergonomic Desk Advisor', 'Dapatkan tips postur kerja dan latihan peregangan untuk mencegah nyeri punggung saat bekerja.', '--- Slide 1 ---
Saya sering bekerja di depan komputer selama [Jumlah Jam, misal: 8] jam sehari dan sering merasakan nyeri pada bagian [Sebutkan Bagian Tubuh, misal: leher dan punggung bawah]. Tolong berikan panduan ergonomis untuk posisi duduk dan setup meja kerja saya (posisi layar monitor, kursi, keyboard, dan lengan).

--- Slide 2 ---
Tunjukkan 4 gerakan peregangan meja kerja (desk stretches) sederhana yang bisa saya lakukan dalam waktu 3 menit di kursi kerja saya tanpa mengganggu pekerjaan.

--- Slide 3 ---
Jelaskan aturan ''20-20-20'' untuk kesehatan mata dan bagaimana cara terbaik mengintegrasikan pengingat peregangan berkala ke dalam alur kerja harian saya.', NULL, '3', false, 112)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t19-stress-plan', 'Stress Management Action Plan', 'Rancang strategi penanganan stres darurat saat menghadapi situasi tekanan tinggi di tempat kerja.', '--- Slide 1 ---
Saya sedang berada di bawah tekanan kerja yang sangat tinggi dan merasa kewalahan (overwhelmed). Berikan saya rencana aksi manajemen stres darurat (emergency stress relief plan) yang dapat saya lakukan dalam waktu 10 menit sekarang untuk menurunkan detak jantung dan menjernihkan pikiran.

--- Slide 2 ---
Bantu saya memprioritaskan tugas-tugas saya menggunakan Matriks Eisenhower berdasarkan daftar pekerjaan saya saat ini:
"[Masukkan Daftar Tugas Anda]"

Klasifikasikan tugas-tugas tersebut ke dalam 4 kuadran: Mendesak & Penting, Penting tapi Tidak Mendesak, Mendesak tapi Tidak Penting, dan Tidak Keduanya.

--- Slide 3 ---
Berikan kalimat afirmasi positif (mindset shifts) yang realistis untuk membantu saya memandang situasi tekanan ini secara objektif tanpa panik berlebihan.', NULL, '3', true, 97)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t20-bug-finder', 'Code Bug Finder & Explainer', 'Temukan bug tersembunyi di kode Anda, dapatkan penjelasan penyebabnya, dan solusi perbaikan terbaik.', '--- Slide 1 ---
Berikut adalah kode saya dalam bahasa [Bahasa Pemrograman]:
"""
[Masukkan Kode Anda Di Sini]
"""

Kode ini mengalami masalah atau error: [Jelaskan Error/Masalahnya]. Tolong analisis di mana letak kesalahan (bug) pada kode tersebut dan jelaskan mengapa bug itu bisa terjadi dengan bahasa yang mudah dipahami.

--- Slide 2 ---
Berikan kode hasil perbaikan yang sudah benar, bersih, dan mengikuti praktik terbaik (best practices) penulisan kode. Berikan komentar penjelasan pada baris-baris kode yang diubah.

--- Slide 3 ---
Sebutkan langkah-langkah pencegahan atau pengujian (unit testing/validation) yang bisa saya terapkan di masa mendatang agar bug serupa tidak terulang kembali pada proyek ini.', NULL, '4', false, 541)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t21-system-design', 'System Design Architect', 'Rancang arsitektur sistem backend yang scalable, andal, dan aman untuk aplikasi Anda.', '--- Slide 1 ---
Saya ingin merancang sistem backend untuk aplikasi [Deskripsi Aplikasi, misal: e-commerce dengan trafik tinggi]. Kebutuhan utama sistem ini adalah mampu menangani [Jumlah Pengguna, misal: 50.000 aktif harian] dan membutuhkan fitur [Sebutkan Fitur Utama, misal: pembayaran real-time]. Tolong buatkan usulan arsitektur sistem tingkat tinggi (High-Level System Design) beserta komponen teknologi yang direkomendasikan (database, cache, message broker, dll).

--- Slide 2 ---
Jelaskan strategi yang Anda pilih untuk memastikan sistem ini memiliki ketersediaan tinggi (High Availability), toleransi kesalahan (Fault Tolerance), serta bagaimana cara menangani lonjakan trafik secara tiba-tiba (scalability strategy).

--- Slide 3 ---
Sebutkan 3 risiko keamanan utama (security threats) pada arsitektur sistem ini berdasarkan standar OWASP Top 10, beserta taktik mitigasi konkret untuk masing-masing risiko tersebut.', NULL, '4', true, 289)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t22-git-commits', 'Git Commit Standardizer', 'Format riwayat commit Git Anda secara rapi mengikuti standar Conventional Commits.', '--- Slide 1 ---
Berikut adalah deskripsi perubahan kode yang baru saja saya lakukan:
"[Jelaskan Perubahan Kode Anda, misal: memperbaiki bug crash saat klik tombol login dan menambahkan animasi loading]"

Tolong buatkan pesan commit Git (Git Commit Message) yang mengikuti standar "Conventional Commits" (menggunakan tipe seperti feat, fix, docs, style, refactor, test, chore). Tulis pesan ini dalam format bahasa Inggris.

--- Slide 2 ---
Berikan opsi variasi pesan commit jika perubahan tersebut ingin dipecah menjadi 2 commit terpisah yang lebih atomik (kecil dan spesifik) sesuai praktik Git terbaik.

--- Slide 3 ---
Berikan perintah CLI Git (Git commands) lengkap yang harus saya jalankan di terminal untuk membuat commit tersebut dan mendorongnya (push) ke repositori remote (GitHub/GitLab).', NULL, '4', false, 174)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t23-sql-generator', 'SQL Generator & Optimizer', 'Ubah kebutuhan bisnis menjadi query SQL yang dioptimalkan untuk performa tinggi.', '--- Slide 1 ---
Saya memiliki struktur tabel database berikut:
- Tabel `users` (id, name, email, created_at)
- Tabel `orders` (id, user_id, total_price, status, order_date)
[Masukkan info tabel lain jika ada]

Tolong buatkan query SQL untuk kebutuhan bisnis berikut:
"[Jelaskan Data Apa yang Ingin Diambil, misal: Dapatkan daftar 10 user teratas yang melakukan transaksi terbanyak dengan status lunas bulan lalu]"

Gunakan dialek database [MySQL/PostgreSQL/SQL Server].

--- Slide 2 ---
Analisis kinerja query SQL yang Anda buat di atas. Apakah query tersebut efisien? Rekomendasikan indeks (indexes) apa saja yang wajib saya buat pada tabel agar query ini berjalan sangat cepat meskipun data berukuran jutaan baris.

--- Slide 3 ---
Tunjukkan cara mengoptimalkan query tersebut jika di masa mendatang kita perlu melakukan paginasi data (pagination) secara efisien menggunakan metode Keyset Pagination alih-alike OFFSET.', NULL, '4', false, 312)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t24-docker-config', 'Docker Containerizer', 'Buat konfigurasi Dockerfile dan Docker Compose untuk kontainerisasi aplikasi Anda.', '--- Slide 1 ---
Saya memiliki aplikasi yang dibuat menggunakan teknologi stack: [Sebutkan Stack, misal: Node.js dengan Express dan database PostgreSQL]. Struktur direktori proyek saya adalah standar. Tolong buatkan file konfigurasi `Dockerfile` yang dioptimalkan untuk mode produksi (menggunakan multi-stage build untuk memperkecil ukuran image dan meningkatkan keamanan).

--- Slide 2 ---
Buatkan file konfigurasi `docker-compose.yml` untuk menjalankan aplikasi tersebut bersama-sama dengan kontainer database pendukungnya, lengkap dengan konfigurasi volume untuk persistensi data dan environment variables.

--- Slide 3 ---
Berikan daftar perintah CLI Docker yang harus saya jalankan di komputer lokal untuk membangun image (build) dan menjalankan seluruh layanan kontainer tersebut di latar belakang (detached mode).', NULL, '4', true, 220)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount) VALUES
('t25-api-docs', 'API Documentation Generator', 'Ubah kode endpoint controller Anda menjadi dokumentasi OpenAPI/Swagger yang rapi.', '--- Slide 1 ---
Berikut adalah kode program backend endpoint controller saya:
"""
[Masukkan Kode Controller/Route Anda Di Sini, misal: router.post(''/login'', ...)]
"""

Tolong buatkan dokumentasi API yang rapi untuk endpoint tersebut menggunakan standar spesifikasi OpenAPI 3.0 dalam format YAML. Sertakan deskripsi parameter request body, header, serta skema respons sukses (200/201) dan respons error (400/401/500).

--- Slide 2 ---
Buat versi dokumentasi yang sama dalam format Markdown agar mudah saya tempel langsung ke file README.md repositori GitHub saya.

--- Slide 3 ---
Berikan contoh payload pengujian (request payload) menggunakan format perintah `curl` agar developer frontend dapat langsung mencobanya di terminal mereka.', NULL, '4', true, 165)
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), content=VALUES(content), categoryId=VALUES(categoryId), isPremium=VALUES(isPremium), usageCount=VALUES(usageCount);

