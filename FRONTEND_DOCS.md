# 📱 Dokumentasi Frontend - Aplikasi Mobile Flutter

Dokumentasi ini menjelaskan arsitektur, organisasi berkas, mekanisme manajemen status (*state management*), serta pemanfaatan database lokal (*caching*) pada aplikasi mobile **PromptStudio AI** yang dibangun menggunakan Flutter.

---

## 📂 Struktur Berkas Frontend (`lib/`)

Kode sumber Flutter terorganisir di bawah direktori `lib/` sebagai berikut:

* **[core/](lib/core)**: Berisi fungsionalitas inti aplikasi yang tidak terikat langsung ke layar spesifik.
  * `database/`: Berisi `database_service.dart` yang mengelola SQLite local cache.
  * `theme/`: Skema warna premium untuk tema gelap (*dark mode*) dan terang (*light mode*).
  * `network/`: Klien HTTP untuk berkomunikasi dengan Backend API Gateway.
* **[data/](lib/data)**: Model objek data (*data models*) seperti `User`, `PromptHistory`, `Template`, dan `DesignStyle`.
* **[providers/](lib/providers)**: Pengelola status aplikasi (*state providers*) yang mengikat data logis dengan UI secara reaktif.
* **[widgets/](lib/widgets)**: Komponen UI modular yang dapat digunakan kembali (*reusable widgets*) seperti kartu gaya desain, tombol pemuatan, dan kolom input.
* **[screens/](lib/screens)**: Layar utama aplikasi yang dikelompokkan berdasarkan modul fitur:
  * `auth/`: Layar Registrasi, Login, dan Verifikasi Sesi.
  * `dashboard/`: Layar Beranda utama dengan panel statistik singkat dan daftar cepat.
  * `prompt/`: Seluruh generator AI kustom (Iklan, Edukasi, Quote, dll.) dan layar detail hasil prompa.
  * `template/`: Katalog pencarian template prompa global.
  * `riwayat/`: Layar riwayat pembuatan prompa pribadi.
  * `settings/`: Layar manajemen profil, tab target audiens, dan manajemen rotasi API Keys untuk administrator.

---

## ⚡ Manajemen Status (State Management - Provider)

Aplikasi ini menggunakan paket **Provider** untuk mengelola state secara reaktif, memisahkan logika bisnis dari UI. Pengelola utama status adalah **[prompt_provider.dart](lib/providers/prompt_provider.dart)**.

### Fitur Utama PromptProvider:
1. **Sinkronisasi Parameter**: Menyimpan pilihan gaya visual, orientasi canvas, target audiens, dan status karakter AI aktif selama formulir pengisian berjalan.
2. **Komunikasi API Gateway**: Menangani status pemuatan (*loading indicator*), mengirim data formulir ke backend, dan menangkap hasil prompa dari AI secara asinkron.
3. **Manajemen Favorit**: Mengelola aksi toggle untuk menambah atau menghapus prompa dari daftar favorit lokal yang disinkronkan ke server secara real-time.

---

## 🗢 Basis Data Lokal SQLite (Local Cache SQLite)

Untuk menjamin kegunaan aplikasi saat kondisi jaringan tidak stabil (offline capability) dan mengurangi beban query ke server, aplikasi menggunakan basis data lokal SQLite yang dikelola oleh **[database_service.dart](lib/core/database/database_service.dart)**.

### Skema Tabel Lokal:
1. `categories`: Menyimpan salinan kategori prompa (Bisnis, Edukasi, Kesehatan, dll.).
2. `design_styles`: Menyimpan metadata gaya visual lengkap dengan referensi gambar contoh.
3. `target_audiences`: Menyimpan opsi audiens target untuk dropdown formulir.
4. `digital_product_types`: Menyimpan jenis-jenis produk digital (e-book, course, dll.).
5. `prompt_histories`: Menyimpan cache riwayat prompa yang sukses dihasilkan.
6. `favorite_prompts`: Menyimpan cache daftar favorit lokal.
7. `groq_api_keys`: Cache lokal data status kunci API (Khusus Admin).

*Proses sinkronisasi dilakukan secara berkala saat aplikasi mendeteksi koneksi internet stabil (online) melalui API sinkronisasi.*

---

## 🎛️ Analisis Generator Layar Prompa (`lib/screens/prompt/`)

Folder **[prompt/](lib/screens/prompt)** menyimpan logika visual untuk input dan output pembuatan prompt AI:

1. **`prompt_selection_screen.dart`**
   * Layar perantara untuk memilih tipe generator prompa yang ingin dibuat.
2. **`prompt_generator_screen.dart`**
   * Generator default/umum untuk pembuatan prompa teks berbasis input bebas.
3. **`ad_prompt_generator_screen.dart`**
   * UI khusus untuk konten promosi iklan (affiliate). Pengguna memasukkan nama produk, nilai jual utama (*USP*), platform media sosial (TikTok/IG), orientasi gambar (3:4, 16:9), target audiens, dan gaya visual.
4. **`banner_prompt_generator_screen.dart`**
   * UI pembuatan prompt untuk banner grafis komersial dengan orientasi horizontal dominan (16:9).
5. **`logo_prompt_generator_screen.dart`**
   * UI pembuatan prompt logo brand dengan input nama bisnis, slogan, warna dominan, dan kategori industri.
6. **`quote_prompt_generator_screen.dart`**
   * UI pembuat prompa kata mutiara sinematik dengan mood selector (misal: Sedih, Motivasi, Cinta, Religius) yang mendeteksi kata secara otomatis untuk menyesuaikan instruksi prompt visual landscape.
7. **`digital_product_generator_screen.dart`**
   * UI pembuat prompa promosi produk digital. Memiliki field jenis produk digital (Course/E-book) dan target market.
8. **`prompt_detail_screen.dart`**
   * Layar keluaran (output screen). Menampilkan teks instruksi visual per slide hasil olahan Groq AI dalam bentuk carousel horizontal yang elegan. Menyediakan tombol **Salin Prompt (Copy)** untuk memudahkan pengguna menyalin teks dan mengunggahnya ke AI pembuat gambar (Midjourney/DALL-E) atau AI teks (ChatGPT).
