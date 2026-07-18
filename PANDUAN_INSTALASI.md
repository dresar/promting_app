# 📦 Panduan Instalasi Lengkap

<div align="center">

![Instalasi](https://img.shields.io/badge/Instalasi-Complete-green?style=for-the-badge)

**Panduan step-by-step untuk menginstall PromptStudio AI**

</div>

---

## 📋 Daftar Isi

1. [Prerequisites](#-prerequisites)
2. [Instalasi Frontend (Flutter)](#-instalasi-frontend-flutter)
3. [Instalasi Backend (Node.js)](#-instalasi-backend-nodejs)
4. [Konfigurasi Database](#-konfigurasi-database)
5. [Konfigurasi Environment](#-konfigurasi-environment)
6. [Menjalankan Aplikasi](#-menjalankan-aplikasi)
7. [Troubleshooting](#-troubleshooting)

---

## 🔧 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall software berikut:

### Required Software

| Software | Versi Minimum | Link Download |
|----------|---------------|---------------|
| **Flutter SDK** | 3.12.2 | [Download](https://docs.flutter.dev/get-started/install) |
| **Dart SDK** | 3.12.2 | (Included with Flutter) |
| **Node.js** | 18.x | [Download](https://nodejs.org/) |
| **MySQL** | 8.0 | [Download](https://dev.mysql.com/downloads/) |
| **Git** | Latest | [Download](https://git-scm.com/) |

### Verifikasi Instalasi

```bash
# Cek Flutter
flutter --version

# Cek Dart
dart --version

# Cek Node.js
node --version

# Cek npm
npm --version

# Cek MySQL
mysql --version

# Cek Git
git --version
```

---

## 📱 Instalasi Frontend (Flutter)

### Step 1: Clone Repository

```bash
git clone https://github.com/dresar/promting_app.git
cd promting_app
```

### Step 2: Install Dependencies

```bash
flutter pub get
```

**Output yang diharapkan:**
```
Running "flutter pub get" in promting_app...
Resolving dependencies...
+ flutter_riverpod 2.5.1
+ go_router 14.2.0
+ flutter_secure_storage 9.2.2
...
Got dependencies!
```

### Step 3: Konfigurasi Platform

#### Android Setup

1. Buka `android/app/build.gradle.kts`
2. Pastikan `minSdk` minimal versi 21
3. Update `targetSdk` ke versi terbaru

```kotlin
android {
    namespace = "com.example.promting_app"
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.example.promting_app"
        minSdk = 21
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }
}
```

#### iOS Setup

```bash
cd ios
pod install
cd ..
```

### Step 4: Jalankan Aplikasi

```bash
# Run di emulator/simulator
flutter run

# Run di device tertentu
flutter devices
flutter run -d <device_id>

# Run dalam mode release
flutter run --release
```

### Step 5: Build untuk Production

```bash
# Android APK
flutter build apk --release

# Android App Bundle
flutter build appbundle --release

# iOS
flutter build ios --release

# Web
flutter build web --release

# Windows
flutter build windows --release

# macOS
flutter build macos --release

# Linux
flutter build linux --release
```

---

## 🖥️ Instalasi Backend (Node.js)

### Step 1: Navigasi ke Folder Backend

```bash
cd backednya
```

### Step 2: Install Dependencies

```bash
npm install
```

**Output yang diharapkan:**
```
added 150 packages, and audited 151 packages in 15s

20 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Step 3: Build TypeScript

```bash
npm run build
```

Ini akan mengkompilasi kode TypeScript ke JavaScript di folder `dist/`.

### Step 4: Jalankan Server

```bash
# Production mode
npm start

# Development mode (dengan auto-reload)
npm run dev
```

Server akan berjalan di `http://localhost:3000`

---

## 🗄️ Konfigurasi Database

### Step 1: Buat Database MySQL

```sql
-- Login ke MySQL
mysql -u root -p

-- Buat database
CREATE DATABASE promptstudio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Buat user (opsional)
CREATE USER 'promptstudio'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON promptstudio_db.* TO 'promptstudio'@'localhost';
FLUSH PRIVILEGES;

-- Gunakan database
USE promptstudio_db;
```

### Step 2: Import Schema & Seed Data

```bash
# Dari root folder proyek
mysql -u root -p promptstudio_db < seed_templates.sql
```

### Step 3: Verifikasi Tabel

```sql
USE promptstudio_db;
SHOW TABLES;

-- Expected tables:
-- - users
-- - prompts
-- - templates
-- - categories
-- - options
-- - configs
```

---

## ⚙️ Konfigurasi Environment

### Backend Environment (.env)

Buat file `.env` di folder `backednya/`:

```bash
cd backednya
touch .env
```

Isi dengan konfigurasi berikut:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=promptstudio_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

⚠️ **PENTING**: Ganti `your_mysql_password` dan `your_super_secret_jwt_key_change_this_in_production` dengan nilai yang aman!

### Frontend Configuration

File konfigurasi frontend sudah tersedia di `app_config.json`:

```json
{
  "apiBaseUrl": "http://localhost:3000",
  "appName": "PromptStudio AI",
  "version": "1.0.0"
}
```

Update `apiBaseUrl` sesuai dengan alamat backend Anda.

---

## 🚀 Menjalankan Aplikasi

### Opsi 1: Menjalankan Secara Terpisah

**Terminal 1 - Backend:**
```bash
cd backednya
npm run dev
```

**Terminal 2 - Frontend:**
```bash
flutter run
```

### Opsi 2: Menjalankan dengan Script (Recommended)

Buat script `start.sh` (Linux/Mac) atau `start.bat` (Windows):

**start.sh (Linux/Mac):**
```bash
#!/bin/bash

echo "🚀 Starting PromptStudio AI..."

# Start backend
cd backednya
npm run dev &
BACKEND_PID=$!

echo "✅ Backend started (PID: $BACKEND_PID)"

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ..
flutter run

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
```

**start.bat (Windows):**
```batch
@echo off
echo 🚀 Starting PromptStudio AI...

:: Start backend
start cmd /k "cd backednya && npm run dev"

:: Wait
timeout /t 3 /nobreak >nul

:: Start frontend
flutter run
```

---

## 🔍 Troubleshooting

### ❌ Error: Flutter pub get failed

**Solusi:**
```bash
# Clean cache
flutter clean
flutter pub cache repair

# Try again
flutter pub get
```

### ❌ Error: MySQL connection refused

**Solusi:**
1. Pastikan MySQL service berjalan
2. Cek username dan password di `.env`
3. Verifikasi port MySQL (default: 3306)

```bash
# Cek status MySQL (Linux)
sudo systemctl status mysql

# Restart MySQL (Linux)
sudo systemctl restart mysql
```

### ❌ Error: Port 3000 already in use

**Solusi:**
```bash
# Cari proses yang menggunakan port 3000
lsof -i :3000

# Kill proses tersebut
kill -9 <PID>

# Atau ganti port di .env
PORT=3001
```

### ❌ Error: Permission denied (Android)

**Solusi:**
Tambahkan permissions di `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

### ❌ Error: CocoaPods not installed (iOS)

**Solusi:**
```bash
# Install CocoaPods
sudo gem install cocoapods

# Navigate to iOS folder
cd ios
pod setup
pod install
cd ..
```

### ❌ Error: TypeScript compilation failed

**Solusi:**
```bash
cd backednya

# Clear node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

---

## ✅ Verifikasi Instalasi

### Test Backend API

```bash
# Test endpoint
curl http://localhost:3000/api/health

# Expected response:
# {"status": "ok", "message": "Server is running"}
```

### Test Frontend

1. Jalankan aplikasi Flutter
2. Coba login/register
3. Verifikasi koneksi ke backend
4. Test CRUD operations

### Test Admin Panel

Buka browser dan akses:
```
http://localhost:3000/admin
```

---

## 📞 Bantuan Lebih Lanjut

Jika mengalami masalah yang tidak tercantum di atas:

1. 📚 Baca dokumentasi lengkap di [README.md](README.md)
2. 🐛 Laporkan issue di [GitHub Issues](https://github.com/dresar/promting_app/issues)
3. 💬 Diskusi di [GitHub Discussions](https://github.com/dresar/promting_app/discussions)

---

<div align="center">

**Selamat! Anda telah berhasil menginstall PromptStudio AI** 🎉

Lanjut ke [Panduan Penggunaan](PANDUAN_PENGGUNAAN.md) untuk mempelajari cara menggunakan aplikasi.

</div>
