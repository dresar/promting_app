# 📖 Panduan Penggunaan Fitur Aplikasi & Panel Admin Web

Dokumentasi ini menjelaskan panduan praktis bagi pengguna umum (*standard users*) untuk menghasilkan prompa menggunakan aplikasi mobile, serta bagi administrator (*admin role*) untuk mengelola konfigurasi sistem melalui Web Admin Panel.

---

## 📱 1. Panduan Penggunaan Aplikasi Mobile (Bagi Pengguna)

### Langkah A: Registrasi & Masuk Akun
1. Buka aplikasi, jika Anda belum memiliki akun, klik **Daftar** dan isi nama, email, serta kata sandi.
2. Jika sudah terdaftar, masukkan email dan kata sandi pada halaman **[Login Welcome Screen](assets/demo/mobile_login.jpg)** lalu klik **Masuk**.

### Langkah B: Menjelajahi Dasbor Beranda
Pada halaman **[Beranda](assets/demo/mobile_dashboard.jpg)**, Anda dapat:
* Melihat jalan pintas generator konten (Prompa Edukasi, Iklan Affiliate, Kata Mutiara).
* Memilih kategori spesifik (Bisnis, Edukasi, Kesehatan).
* Memilih **Template Populer** untuk menggunakan template prompt siap pakai.
* Mengubah tema gelap/terang secara instan melalui ikon matahari/bulan di sudut atas.

### Langkah C: Membuat Prompt AI Baru (Contoh: Edukasi)
1. Pilih menu **Buat Prompt** atau klik pintasan **Prompa Edukasi**.
2. Di halaman **[Generator Prompa Edukasi](assets/demo/mobile_generator.jpg)**:
   * Ketik **Judul / Topik Konten** Anda (misal: "Kebiasaan Membuat Otak Tajam").
   * Pilih **Jenis Konten** & **Jumlah Slide** (misal: 5 slide).
   * Geser dan pilih **Gaya Visual** yang Anda sukai (misal: *Abstract Clay* atau *Neo-Brutalist*).
   * Pilih **Orientasi Gambar** (3:4, 4:5, atau 1:1) dan **Target Audiens** (misal: *Investor Pemula*).
   * Jika ingin menyertakan karakter visual yang konsisten pada gambar, aktifkan toggle **Gunakan Karakter AI** dan pilih karakter yang diinginkan (misal: Anya).
3. Klik tombol **Buat Prompt Sekarang** (atau **Generate**).
4. Hasil pemrosesan akan ditampilkan di layar **Detail Prompt**. Layar ini menampilkan petunjuk (prompt) gambar visual terpisah per slide. Anda cukup menekan tombol **Salin (Copy)** untuk menggunakannya di AI generator gambar (seperti Midjourney atau Leonardo AI).

### Langkah D: Mengelola Riwayat & Favorit
* Masuk ke tab **Riwayat** pada bilah navigasi bawah untuk melihat riwayat prompa yang sudah pernah Anda buat sebelumnya.
* Tekan tombol **Simbol Hati (Favorit)** pada item riwayat untuk memasukannya ke daftar favorit sehingga dapat diakses kembali dengan cepat.

---

## 🖥️ 2. Panduan Penggunaan Panel Admin Web (Bagi Administrator)

Untuk masuk ke admin panel, pastikan akun Anda memiliki role `ADMIN`.

### Langkah A: Mengakses Web Admin
1. Hubungkan browser Anda ke alamat: `http://localhost:3000/admin` (atau klik **Buka Panel Admin di Aplikasi** pada **[Tab Pengaturan Umum](assets/demo/mobile_settings_general.jpg)**).
2. Lakukan login menggunakan akun administrator Anda.

### Langkah B: Mengelola Konfigurasi Sistem
Terdapat 6 menu navigasi utama di bilah samping kiri admin panel:

1. **Target Audiens**:
   * Untuk mengelola segmentasi audiens yang bisa dipilih pengguna.
   * Admin dapat menambahkan (klik `+ Tambah Audiens`), mengubah nama, atau menghapus item target audiens.
2. **Gaya & Tema Desain**:
   * Tempat mengonfigurasi deskripsi prompt visual dasar untuk setiap gaya visual yang ditawarkan kepada pengguna aplikasi mobile.
3. **Templates & Preset**:
   * Menyusun preset prompa terstruktur pra-desain. Template yang dimasukkan di sini otomatis muncul di daftar template pengguna mobile untuk mempermudah pemicuan cepat.
4. **Karakter AI**:
   * Menambahkan karakter konsisten. Tuliskan deskripsi fisik rinci (misal: *Japanese anime character illustration, beautiful girl wearing glasses, wearing lab coat...*) agar generator AI menghasilkan penggambaran visual tokoh secara konsisten pada setiap slide.
5. **Riwayat Prompt**:
   * Memantau log penggunaan sistem secara menyeluruh dari seluruh user terdaftar.
6. **Groq API Keys**:
   * Tempat krusial untuk menginput kunci API Groq Anda (`gsk_...`).
   * Anda bisa memasukkan banyak kunci sekaligus. Jika kunci mengalami error limit, administrator dapat memantau hitungan kegagalan (*error count*) dan menekan ikon **Reset / Refresh Key** setelah kendala rate-limit terlewati untuk mengembalikannya kunci ke kondisi aktif.
