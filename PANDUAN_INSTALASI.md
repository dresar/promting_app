# 🛠️ Panduan Instalasi dan Setup Lingkungan Pengembangan

Panduan ini berisi langkah-langkah untuk menyiapkan basis data, menjalankan server backend API Gateway, serta mengompilasi aplikasi seluler Flutter untuk pertama kalinya pada mesin lokal Anda.

---

## ⚙️ 1. Persiapan Basis Data (MySQL Database Setup)

Aplikasi backend memerlukan basis data MySQL aktif.

1. **Buat Basis Data**: Buat database baru bernama `rdsmahat_apk` (atau sesuaikan dengan nama pilihan Anda) pada server MySQL lokal Anda.
2. **Inisialisasi Data Template**: Impor data template prompa dasar menggunakan berkas **[seed_templates.sql](seed_templates.sql)** ke dalam database MySQL Anda:
   ```bash
   mysql -u root -p rdsmahat_apk < seed_templates.sql
   ```

---

## 💻 2. Setup dan Instalasi Backend Gateway

Masuk ke direktori backend terlebih dahulu:
```bash
cd backednya
```

### Langkah A: Buat File Konfigurasi `.env`
Buat berkas bernama `.env` di dalam folder `backednya/` dan lengkapi variabel berikut:
```ini
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=kata_sandi_mysql_anda
DB_NAME=rdsmahat_apk

# Secret key untuk enkripsi JWT
JWT_SECRET=gunakan_secret_kunci_akses_yang_kuat
JWT_REFRESH_SECRET=gunakan_secret_kunci_refresh_yang_kuat

# Integrasi ImageKit untuk unggah asset style gambar
IMAGEKIT_PRIVATE_KEY=your_private_key_imagekit
```

### Langkah B: Instalasi Dependensi & Jalankan Server
1. **Pasang paket dependensi node**:
   ```bash
   npm install
   ```
2. **Jalankan server dalam mode pengembangan (development mode)**:
   ```bash
   npm run dev
   ```
   *Server akan berjalan secara lokal di alamat: `http://localhost:3000`*
3. **Kompilasi build untuk produksi**:
   ```bash
   npm run build
   ```
   *Perintah ini akan menjalankan esbuild dan mengemas aplikasi menjadi file tunggal `app.js` yang siap dijalankan di server production menggunakan perintah `npm start`.*

---

## 📱 3. Setup dan Instalasi Frontend (Flutter Mobile Client)

Pastikan Flutter SDK (versi >= 3.19) sudah terpasang dengan benar pada sistem Anda. Jalankan perintah `flutter doctor` untuk memeriksa kesiapan.

### Langkah A: Konfigurasi Endpoint Aplikasi (`app_config.json`)
Aplikasi mobile Flutter menggunakan file konfigurasi eksternal untuk menentukan alamat API Gateway. Buka berkas **[app_config.json](app_config.json)** di root folder proyek, kemudian atur alamat backend Anda:
```json
{
  "apiBaseUrl": "http://10.0.2.2:3000",
  "appName": "PromptStudio AI"
}
```
> [!TIP]
> * Gunakan `http://10.0.2.2:3000` jika Anda menjalankan aplikasi di **Android Emulator** untuk merujuk ke localhost komputer.
> * Gunakan IP lokal komputer Anda (misal: `http://192.168.1.10:3000`) jika Anda melakukan uji coba langsung menggunakan **Ponsel Fisik (Real Device)** yang terhubung satu jaringan Wi-Fi.

### Langkah B: Pasang Dependensi & Jalankan Aplikasi
1. **Unduh seluruh paket library Flutter**:
   ```bash
   flutter pub get
   ```
2. **Jalankan aplikasi di perangkat target / emulator**:
   ```bash
   flutter run
   ```
3. **Kompilasi paket APK untuk rilis Android**:
   ```bash
   flutter build apk --release
   ```
   *File APK rilis yang dapat dipasang di ponsel Android akan tersimpan di direktori: `build/app/outputs/flutter-apk/app-release.apk`.*
