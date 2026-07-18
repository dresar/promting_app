# 🚀 PromptStudio AI

<div align="center">

![Logo](assets/images/logo.png)

**Platform Manajemen Prompt AI Terintegrasi**

[![Flutter](https://img.shields.io/badge/Flutter-3.12.2-blue?logo=flutter)](https://flutter.dev)
[![Dart](https://img.shields.io/badge/Dart-3.12.2-blue?logo=dart)](https://dart.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-blue?logo=typescript)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/Database-MySQL-orange?logo=mysql)](https://www.mysql.com)

[📱 Demo Aplikasi](#-demo-aplikasi) • [🎨 Demo Backend](#-demo-backend) • [📦 Instalasi](#-instalasi) • [✨ Fitur](#-fitur-utama) • [🛠️ Teknologi](#-stack-teknologi)

</div>

---

## 📖 Tentang Proyek

**PromptStudio AI** adalah aplikasi manajemen prompt AI yang komprehensif dengan backend terintegrasi. Aplikasi ini memungkinkan pengguna untuk membuat, mengelola, dan mengorganisir berbagai template prompt untuk berbagai keperluan AI dengan antarmuka yang modern dan user-friendly.

### 🎯 Tujuan Aplikasi

- 💡 **Manajemen Prompt**: Simpan dan organisir prompt AI favorit Anda
- 🎨 **Template System**: Gunakan template yang sudah ada atau buat template kustom
- 📊 **Dashboard Admin**: Panel administrasi lengkap untuk manajemen konten
- 🔐 **Keamanan**: Sistem autentikasi JWT yang aman
- 📱 **Multi-platform**: Berjalan di Android, iOS, Web, Windows, macOS, dan Linux

---

## ✨ Fitur Utama

### 📱 Aplikasi Mobile (Flutter)

| Fitur | Deskripsi |
|-------|-----------|
| 🏠 **Dashboard** | Tampilan utama dengan statistik dan prompt terbaru |
| 🔍 **Browse Prompts** | Jelajahi berbagai kategori prompt AI |
| ⭐ **Favorite System** | Simpan prompt favorit untuk akses cepat |
| 📝 **Template Manager** | Kelola template prompt dengan mudah |
| ⚙️ **Settings** | Kustomisasi tema dan preferensi aplikasi |
| 🔐 **Auth System** | Login/Register dengan keamanan JWT |
| 🎨 **Modern UI** | Desain Material 3 dengan animasi smooth |

### 🖥️ Backend Admin Panel

| Fitur | Deskripsi |
|-------|-----------|
| 📊 **Analytics Dashboard** | Statistik penggunaan dan insights |
| 👥 **User Management** | Kelola pengguna dan permissions |
| 📝 **Prompt Management** | CRUD operations untuk semua prompt |
| 🏷️ **Category Manager** | Organisir prompt berdasarkan kategori |
| 🎯 **Template Editor** | Editor template dengan preview |
| ⚙️ **System Config** | Konfigurasi aplikasi global |
| 📁 **File Upload** | Manajemen upload gambar dan assets |

---

## 🎨 Demo Aplikasi

### Screenshots Aplikasi

<div align="center">

#### 🏠 Halaman Dashboard
![Dashboard Demo](assets/images/launcher_logo.png)
*Dashboard utama dengan navigasi intuitif dan statistik real-time*

#### 📱 Fitur Utama
- **Tema Gelap/Terang**: Switch tema sesuai preferensi
- **Navigasi Smooth**: GoRouter untuk navigasi yang optimal
- **State Management**: Riverpod untuk manajemen state yang efisien
- **Offline Support**: SQLite untuk penyimpanan lokal

</div>

---

## 🖥️ Demo Backend

### Admin Panel Preview

<div align="center">

#### 🔐 Akses Admin Panel
**URL**: [https://promting.apprentice.cyou/admin](https://promting.apprentice.cyou/admin)

#### Fitur Admin:
- 📊 Real-time analytics dashboard
- 👤 User management dengan role-based access
- 📝 Content management system
- 🔧 Configuration panel
- 📈 Usage statistics dan reporting

</div>

---

## 🛠️ Stack Teknologi

### Frontend (Flutter)

```yaml
dependencies:
  flutter: ^3.12.2
  flutter_riverpod: ^2.5.1      # State management
  go_router: ^14.2.0            # Routing
  flutter_secure_storage: ^9.2.2 # Secure storage
  shared_preferences: ^2.2.3    # Local storage
  cached_network_image: ^3.3.1  # Image caching
  image_picker: ^1.1.2          # Image selection
  flutter_animate: ^4.5.0       # Animations
  google_fonts: ^6.2.1          # Custom fonts
  shimmer: ^3.0.0               # Loading effects
  connectivity_plus: ^6.0.3     # Network monitoring
  
  # Backend embedded
  postgres: ^3.5.5              # Database connection
  dart_jsonwebtoken: ^3.4.1     # JWT handling
  bcrypt: ^1.2.0                # Password hashing
  sqflite: ^2.4.3               # Local database
  dio: ^5.10.0                  # HTTP client
  permission_handler: ^12.0.3   # Permissions
  webview_flutter: ^4.14.0      # WebView support
```

### Backend (Node.js + TypeScript)

```json
{
  "express": "^4.19.2",
  "mysql2": "^3.10.1",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^5.1.1",
  "cors": "^2.8.5",
  "multer": "^2.1.0",
  "dotenv": "^16.4.5",
  "typescript": "^5.5.2",
  "esbuild": "^0.21.5"
}
```

---

## 📂 Struktur Proyek

```
promting_app/
├── lib/                          # Flutter source code
│   ├── core/                     # Core utilities & constants
│   │   ├── constants/           # App constants
│   │   ├── router/              # GoRouter configuration
│   │   └── theme/               # Theme configuration
│   ├── data/                     # Data models & repositories
│   ├── providers/                # Riverpod providers
│   ├── screens/                  # UI screens
│   │   ├── auth/                # Login/Register screens
│   │   ├── dashboard/           # Dashboard screens
│   │   ├── prompt/              # Prompt management
│   │   ├── template/            # Template management
│   │   ├── favorite/            # Favorite prompts
│   │   └── settings/            # App settings
│   └── widgets/                  # Reusable widgets
├── backednya/                    # Backend source code
│   ├── src/
│   │   ├── admin/               # Admin panel HTML
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Auth middleware
│   │   └── utils/               # Utility functions
│   └── dist/                    # Compiled output
├── assets/                       # Static assets
│   └── images/                  # App images & icons
├── android/                      # Android platform
├── ios/                          # iOS platform
├── web/                          # Web platform
└── windows/                      # Windows platform
```

---

## 📦 Instalasi

### Prerequisites

- **Flutter SDK** >= 3.12.2
- **Node.js** >= 18.x
- **MySQL** >= 8.0
- **Git**

### Clone Repository

```bash
git clone https://github.com/dresar/promting_app.git
cd promting_app
```

### Setup Frontend (Flutter)

```bash
# Install dependencies
flutter pub get

# Run on device/emulator
flutter run

# Build for production
flutter build apk --release        # Android
flutter build ios --release        # iOS
flutter build web --release        # Web
```

### Setup Backend (Node.js)

```bash
cd backednya

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start

# Development mode
npm run dev
```

📖 **Lihat panduan lengkap instalasi di**: [PANDUAN_INSTALASI.md](PANDUAN_INSTALASI.md)

---

## 🔗 Link Penting

| Resource | URL |
|----------|-----|
| 🌐 **GitHub Repository** | [https://github.com/dresar/promting_app](https://github.com/dresar/promting_app) |
| 🖥️ **Admin Panel** | [https://promting.apprentice.cyou/admin](https://promting.apprentice.cyou/admin) |
| 📚 **Dokumentasi Lengkap** | Lihat folder `docs/` |
| 🐛 **Issue Tracker** | [GitHub Issues](https://github.com/dresar/promting_app/issues) |

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 👨‍💻 Kontribusi

Kami sangat menghargai kontribusi dari komunitas! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

---

## 📞 Kontak

Untuk pertanyaan atau dukungan, silakan hubungi melalui:

- 📧 Email: [Contact via GitHub](https://github.com/dresar)
- 💬 Issues: [GitHub Issues](https://github.com/dresar/promting_app/issues)

---

<div align="center">

**Dibuat dengan ❤️ menggunakan Flutter & Node.js**

⭐ **Jangan lupa berikan bintang jika proyek ini membantu!**

</div>
