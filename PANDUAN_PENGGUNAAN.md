# 📖 Panduan Penggunaan Lengkap

<div align="center">

![Penggunaan](https://img.shields.io/badge/Panduan-Pengguna-blue?style=for-the-badge)

**Panduan lengkap menggunakan PromptStudio AI untuk pengguna**

</div>

---

## 📋 Daftar Isi

1. [Memulai Aplikasi](#-memulai-aplikasi)
2. [Registrasi & Login](#-registrasi--login)
3. [Dashboard Utama](#-dashboard-utama)
4. [Mengelola Prompt](#-mengelola-prompt)
5. [Template System](#-template-system)
6. [Kategori & Organisasi](#-kategori--organisasi)
7. [Favorite Prompts](#-favorite-prompts)
8. [Pengaturan Aplikasi](#-pengaturan-aplikasi)
9. [Tips & Trik](#-tips--trik)

---

## 🚀 Memulai Aplikasi

### First Time Setup

Saat pertama kali membuka aplikasi:

1. **Splash Screen** - Logo aplikasi akan muncul selama 2-3 detik
2. **Onboarding** (jika ada) - Tutorial singkat fitur aplikasi
3. **Login/Register** - Anda akan diarahkan ke halaman autentikasi

### Navigasi Dasar

Aplikasi menggunakan navigasi modern dengan gesture support:

- **Swipe back** - Usap dari kiri ke kanan untuk kembali
- **Bottom Navigation** - Navigasi utama di bagian bawah
- **Drawer Menu** - Menu samping (jika tersedia)

---

## 👤 Registrasi & Login

### Membuat Akun Baru

1. Buka aplikasi
2. Tap **"Daftar"** atau **"Register"**
3. Isi formulir registrasi:
   - 📧 Email
   - 🔒 Password (minimal 8 karakter)
   - 👤 Nama lengkap
   - 📱 Nomor telepon (opsional)

4. Tap **"Daftar"**
5. Verifikasi email (jika diaktifkan)
6. ✅ Akun siap digunakan!

### Login

1. Masukkan **Email** yang terdaftar
2. Masukkan **Password**
3. Tap **"Masuk"**
4. Anda akan diarahkan ke Dashboard

### Fitur Keamanan

- 🔐 **JWT Authentication** - Session aman dengan token
- 💾 **Remember Me** - Tetap login meskipun aplikasi ditutup
- 🔑 **Secure Storage** - Credential tersimpan enkripsi

---

## 🏠 Dashboard Utama

### Overview

Dashboard menampilkan ringkasan aktivitas Anda:

```
┌─────────────────────────────────┐
│  📊 Statistik                   │
│  ├─ Total Prompt: 150           │
│  ├─ Favorite: 25                │
│  └─ Template: 12                │
├─────────────────────────────────┤
│  ⭐ Recent Favorites            │
│  • Prompt AI Writing #1         │
│  • Image Generation Pro         │
│  • Code Helper Template         │
├─────────────────────────────────┤
│  🕐 Recently Used               │
│  • Marketing Copy Generator     │
│  • Email Writer Assistant       │
└─────────────────────────────────┘
```

### Widget Dashboard

| Widget | Fungsi |
|--------|--------|
| **Quick Stats** | Lihat statistik penggunaan |
| **Recent Favorites** | Akses cepat prompt favorit |
| **Recently Used** | History prompt terakhir digunakan |
| **Quick Actions** | Tombol aksi cepat (+ Prompt, + Template) |

---

## 📝 Mengelola Prompt

### Membuat Prompt Baru

1. Tap tombol **"+"** atau **"Buat Prompt"**
2. Isi detail prompt:
   - **Judul** - Nama prompt (wajib)
   - **Deskripsi** - Penjelasan singkat
   - **Konten** - Isi prompt lengkap
   - **Kategori** - Pilih kategori yang sesuai
   - **Tags** - Tambahkan tag untuk pencarian
   - **Gambar** (opsional) - Upload gambar ilustrasi

3. Tap **"Simpan"**
4. ✅ Prompt berhasil dibuat!

### Mengedit Prompt

1. Buka detail prompt
2. Tap icon **✏️ Edit**
3. Ubah informasi yang diperlukan
4. Tap **"Update"**

### Menghapus Prompt

1. Buka detail prompt
2. Tap icon **🗑️ Delete**
3. Konfirmasi penghapusan
4. ⚠️ Prompt tidak dapat dikembalikan!

### Fitur Advanced

#### Variable Substitution

Gunakan variabel dalam prompt:

```
Tulis artikel tentang {{topik}} dengan gaya {{gaya_penulisan}}.
Panjang artikel sekitar {{jumlah_kata}} kata.
```

Variabel akan diganti saat prompt digunakan.

#### Quick Copy

- Tap icon **📋 Copy** untuk menyalin prompt
- Langsung paste ke ChatGPT, Claude, atau AI lainnya

---

## 🎨 Template System

### Apa itu Template?

Template adalah format prompt yang dapat digunakan berulang kali dengan variabel yang dapat disesuaikan.

### Menggunakan Template

1. Buka menu **Template**
2. Pilih template yang diinginkan
3. Isi variabel yang diminta
4. Tap **"Generate Prompt"**
5. Prompt siap digunakan!

### Contoh Template

#### Template: Article Writer

```
Judul: {{judul}}
Topik: {{topik}}
Gaya: {{gaya}}
Panjang: {{panjang}}

Prompt:
"Tulis sebuah artikel dengan judul '{{judul}}' yang membahas tentang {{topik}}. 
Gunakan gaya penulisan {{gaya}} dengan panjang sekitar {{panjang}} kata."
```

#### Template: Code Generator

```
Bahasa: {{bahasa_pemrograman}}
Fungsi: {{fungsi}}
Input: {{input}}
Output: {{output}}

Prompt:
"Buat fungsi dalam {{bahasa_pemrograman}} yang {{fungsi}}. 
Input: {{input}}, Output yang diharapkan: {{output}}"
```

### Membuat Template Kustom

1. Buka **Template** → **"Buat Template Baru"**
2. Tentukan struktur template
3. Definisikan variabel dengan format `{{nama_variabel}}`
4. Set default values (opsional)
5. Simpan template

---

## 🏷️ Kategori & Organisasi

### Kategori Default

Aplikasi menyediakan kategori default:

- 📝 **Writing** - Prompt untuk menulis artikel, cerita, dll
- 💻 **Coding** - Prompt programming dan development
- 🎨 **Creative** - Prompt kreatif dan seni
- 📊 **Business** - Prompt bisnis dan marketing
- 🔬 **Education** - Prompt edukasi dan pembelajaran
- 🎯 **Productivity** - Prompt produktivitas
- 💬 **Conversation** - Prompt chat dan dialog
- 🔧 **Utility** - Prompt utilitas umum

### Mengelola Kategori

#### Menambah Kategori

1. Buka **Settings** → **Manage Categories**
2. Tap **"+ Add Category"**
3. Masukkan nama kategori
4. Pilih icon (opsional)
5. Simpan

#### Mengedit Kategori

1. Tap icon **✏️** pada kategori
2. Ubah nama atau icon
3. Simpan perubahan

### Filter & Search

#### Filter by Category

1. Buka halaman **Prompts**
2. Tap icon **Filter**
3. Pilih satu atau lebih kategori
4. Apply filter

#### Search Prompts

- Gunakan search bar di bagian atas
- Cari berdasarkan judul, deskripsi, atau konten
- Support keyword multiple: "AI writing article"

#### Sort Options

Urutkan prompt berdasarkan:
- 📅 **Date Created** (Newest/Oldest)
- 📝 **Name** (A-Z / Z-A)
- ⭐ **Most Used**
- ❤️ **Most Favorited**

---

## ⭐ Favorite Prompts

### Menambahkan ke Favorite

1. Buka detail prompt
2. Tap icon **❤️ Heart**
3. Prompt ditambahkan ke favorites
4. Icon berubah menjadi merah

### Mengakses Favorites

1. Buka menu **Favorites** dari navigation
2. Lihat semua prompt favorit
3. Gunakan filter dan search seperti biasa

### Remove from Favorites

1. Buka prompt di folder Favorites
2. Tap icon **❤️ Heart** lagi
3. Prompt dihapus dari favorites

### Smart Folders

- **Recent Favorites** - Favorit yang baru ditambahkan
- **Most Used Favorites** - Favorit yang sering digunakan
- **By Category** - Grup favorites berdasarkan kategori

---

## ⚙️ Pengaturan Aplikasi

### Theme Settings

#### Dark/Light Mode

1. Buka **Settings** → **Appearance**
2. Pilih mode:
   - ☀️ **Light** - Tema terang
   - 🌙 **Dark** - Tema gelap
   - 🔄 **System** - Ikuti pengaturan sistem

#### Custom Colors (Coming Soon)

- Primary color
- Accent color
- Background customization

### Account Settings

#### Profile

1. Buka **Settings** → **Profile**
2. Update informasi:
   - Nama
   - Email
   - Foto profil
   - Bio

#### Change Password

1. **Settings** → **Security** → **Change Password**
2. Masukkan password lama
3. Masukkan password baru
4. Konfirmasi password baru
5. Simpan

#### Logout

1. **Settings** → **Account** → **Logout**
2. Konfirmasi logout
3. Anda akan kembali ke halaman login

### App Preferences

#### Language

- 🇮🇩 Bahasa Indonesia
- 🇺🇸 English
- (More languages coming soon)

#### Notifications

Toggle notifikasi untuk:
- ✅ New features
- ✅ Updates
- ✅ Tips & tricks

#### Data & Storage

- **Clear Cache** - Hapus cache aplikasi
- **Export Data** - Backup data ke JSON
- **Import Data** - Restore dari backup

---

## 💡 Tips & Trik

### Productivity Hacks

#### 1. Quick Access Widget

Tambahkan widget di home screen untuk akses cepat:
- Long press home screen
- Pilih "Widgets"
- Cari "PromptStudio"
- Drag widget yang diinginkan

#### 2. Keyboard Shortcuts (Web/Desktop)

| Shortcut | Fungsi |
|----------|--------|
| `Ctrl/Cmd + N` | New Prompt |
| `Ctrl/Cmd + F` | Search |
| `Ctrl/Cmd + ,` | Settings |
| `Esc` | Close modal |

#### 3. Batch Operations

Pilih multiple prompts untuk:
- Bulk delete
- Bulk add to favorites
- Bulk category change

#### 4. Voice Input (Mobile)

Gunakan voice-to-text untuk:
- Input prompt content
- Search prompts
- Quick notes

### Best Practices

#### Organizing Prompts

✅ **DO:**
- Gunakan kategori yang spesifik
- Tambahkan tags yang relevan
- Beri nama yang deskriptif
- Regular cleanup unused prompts

❌ **DON'T:**
- Terlalu banyak kategori
- Tags yang tidak konsisten
- Nama yang ambigu
- Menyimpan prompt duplikat

#### Template Design

✅ **DO:**
- Buat template modular
- Gunakan variabel yang jelas
- Sertakan contoh penggunaan
- Dokumentasikan setiap variabel

❌ **DON'T:**
- Template terlalu kompleks
- Variabel tanpa deskripsi
- Hardcode values
- Lupa test template

### Advanced Features

#### API Integration (Coming Soon)

Integrasikan dengan:
- OpenAI API
- Anthropic API
- Google AI
- Custom AI endpoints

#### Collaboration (Coming Soon)

- Share prompts dengan tim
- Collaborative editing
- Version history
- Comments & feedback

#### Analytics (Coming Soon)

Track usage:
- Most used prompts
- Peak usage times
- Template effectiveness
- ROI metrics

---

## 🆘 FAQ - Pertanyaan Umum

### Q: Bagaimana cara backup data?

**A:** 
1. Buka **Settings** → **Data & Storage**
2. Tap **"Export Data"**
3. File JSON akan terdownload
4. Simpan di tempat aman

### Q: Apakah data saya aman?

**A:** 
Ya! Data Anda:
- Terenkripsi dengan JWT
- Disimpan dengan secure storage
- Tidak dibagikan ke pihak ketiga
- Dapat dihapus kapan saja

### Q: Bisakah menggunakan offline?

**A:** 
Ya, aplikasi mendukung:
- View saved prompts offline
- Edit prompts offline
- Sync saat online kembali

### Q: Berapa banyak prompt yang bisa disimpan?

**A:** 
Tidak ada batasan! Simpan sebanyak yang Anda mau.

### Q: Bagaimana cara restore data?

**A:**
1. Buka **Settings** → **Data & Storage**
2. Tap **"Import Data"**
3. Pilih file backup JSON
4. Konfirmasi import

---

## 📞 Dukungan

Butuh bantuan lebih lanjut?

- 📧 Email: Support via GitHub
- 💬 Issues: [GitHub Issues](https://github.com/dresar/promting_app/issues)
- 📚 Docs: [Dokumentasi Lengkap](README.md)

---

<div align="center">

**Selamat menggunakan PromptStudio AI!** 🎉

Semoga aplikasi ini membantu produktivitas Anda dalam bekerja dengan AI.

⭐ **Jangan lupa beri rating jika aplikasi ini bermanfaat!**

</div>
