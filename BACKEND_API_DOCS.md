# ⚙️ Dokumentasi Backend - API Gateway Node.js & TypeScript

Dokumentasi ini menjelaskan arsitektur backend, rincian RESTful API endpoints, serta mekanisme rotasi API Key Groq yang diimplementasikan pada server API **PromptStudio AI**.

---

## 📂 Struktur Berkas Backend (`backednya/src/`)

Kode sumber backend ditulis menggunakan TypeScript di bawah direktori `src/` sebagai berikut:

* **[db.ts](backednya/src/db.ts)**: Konfigurasi koneksi basis data menggunakan pool MySQL (`mysql2`). Berisi parser khusus untuk mendukung query dengan parameter format PostgreSQL (`$1`, `$2`) dan konversi casting tipe (`::text`, `::jsonb`) untuk menjaga kecocokan kode lama.
* **[index.ts](backednya/src/index.ts)**: Entry-point aplikasi Express. Menghubungkan middleware, menginisiasi rute endpoint, meluncurkan tugas pembersihan aset tak terpakai secara background, serta menjalankan server pada port 3000.
* **[middleware/](backednya/src/middleware)**: Berisi `auth.ts` untuk verifikasi otentikasi JWT (*JSON Web Token*) pada rute yang dilindungi (*protected routes*).
* **[admin/](backednya/src/admin)**: Berisi `adminHtml.ts` yang mengembalikan kode HTML/CSS statis premium untuk merender dasbor manajemen web administrator pada rute `/admin`.
* **[utils/](backednya/src/utils)**: Modul pembantu umum seperti penanganan path dan manajemen file pembersihan berkas lokal.
* **[controllers/](backednya/src/controllers)**: Berisi logika pengendali rute utama:
  * `authController.ts`: Menangani pendaftaran (*register*), masuk (*login*), peremajaan token (*refresh token*), dan keluar (*logout*).
  * `optionsController.ts`: Mengelola data dropdown seperti audiens, gaya desain, tema, dan kunci API.
  * `prompt/`: Logika pemrosesan prompt AI (Iklan, Banner, Quote, Karakter AI, dll.) menggunakan Groq API.

---

## 🔑 Mekanisme Rotasi Groq API Key (Groq API Key Rotation)

Salah satu keunggulan utama dari backend ini adalah kemampuan **rotasi API Key otomatis** yang diatur dalam **[groqService.ts](backednya/src/controllers/prompt/groqService.ts)**.

### Cara Kerja Rotasi Kunci:
1. **Pemilihan Kunci Terbaik**: Sistem mengambil kunci API aktif dari tabel `groq_api_keys` dengan kueri:
   ```sql
   SELECT api_key FROM groq_api_keys
   WHERE is_active = 1
   ORDER BY error_count ASC, last_used_at ASC
   LIMIT 1;
   ```
   Kueri ini memprioritaskan kunci yang memiliki jumlah kegagalan paling sedikit (*error_count*) dan yang paling jarang digunakan (*last_used_at*) untuk pemerataan beban (load balancing).
2. **Eksekusi & Deteksi Kegagalan**: API Key tersebut digunakan untuk memanggil API Groq. Jika API mengembalikan kode status kesalahan (seperti *Rate Limit* 429 atau *Unauthorized* 401), fungsi `markGroqApiKeyFailed` akan menaikkan nilai kolom `error_count` sebesar `+1` untuk kunci tersebut.
3. **Percobaan Ulang Otomatis (Retry Loop)**: Backend secara otomatis beralih ke kunci berikutnya dalam antrean dan mengulang permintaan (maksimal 3 kali percobaan ulang) sebelum mengembalikan respon kegagalan ke pengguna.

---

## 🌐 Daftar Endpoint RESTful API

Berikut adalah rangkuman rute API utama yang diekspos oleh backend:

### 1. Autentikasi Pengguna (`/api/auth/*`)
| Metode | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `POST` | `/api/auth/register` | Publik | Mendaftarkan akun baru dan membuat pengaturan default. |
| `POST` | `/api/auth/login` | Publik | Memvalidasi kredensial dan mengembalikan Access Token & Refresh Token. |
| `POST` | `/api/auth/refresh` | Publik | Memperbarui Access Token yang kedaluwarsa menggunakan Refresh Token aktif. |
| `POST` | `/api/auth/logout` | Terproteksi | Mencabut masa aktif (*revoke*) Refresh Token pengguna. |

### 2. Pembuatan Prompt AI (`/api/prompt/*`)
Semua endpoint ini memerlukan header `Authorization: Bearer <token>`:
* **`POST /api/prompt/generate`**: Pembuatan prompa umum berbasis masukan bebas.
* **`POST /api/prompt/generate-ad`**: Pembuatan prompa konten iklan produk affiliate terstruktur (memadukan Unique Selling Points, Call to Action, gaya desain visual, dan karakter pendukung).
* **`POST /api/prompt/generate-banner`**: Pembuatan prompa banner media sosial komersial.
* **`POST /api/prompt/generate-logo`**: Pembuatan prompa logo visual berbasis identitas brand/merek.
* **`POST /api/prompt/generate-quote`**: Pembuatan prompa kutipan sinematik. Otomatis menganalisis teks kutipan untuk menentukan kecocokan latar suasana (mood).
* **`POST /api/prompt/generate-digital-product`**: Pembuatan prompa promosi produk digital (misal: E-book atau kelas online).

### 3. Log Riwayat & Favorit (`/api/prompt/history/*` & `/api/prompt/favorite/*`)
| Metode | Endpoint | Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/prompt/history` | User | Mengambil daftar riwayat pembuatan prompa milik pengguna aktif (terpaginasi). |
| `GET` | `/api/prompt/history/all` | Admin | Mengambil seluruh log pembuatan prompt global (khusus Administrator). |
| `GET` | `/api/prompt/history/:id` | User | Mengambil detail teks prompa spesifik berdasarkan ID. |
| `DELETE` | `/api/prompt/history/:id` | User | Menghapus item riwayat pembuatan prompt dari database. |
| `POST` | `/api/prompt/favorite/:id` | User | Menandai suatu riwayat prompa sebagai favorit. |
| `DELETE` | `/api/prompt/favorite/:id` | User | Menghapus tanda favorit dari item riwayat prompa. |

### 4. Manajemen Opsi Panel Admin (`/api/options/*`)
Endpoint ini digunakan oleh admin web panel untuk mengelola metadata konfigurasi:
* **Target Audiens**: `GET`, `POST`, `PUT`, `DELETE` ke `/api/options/audiences`
* **Gaya Desain Visual**: `GET`, `POST`, `PUT`, `DELETE` ke `/api/options/styles`
* **Tema Visual**: `GET`, `POST`, `PUT`, `DELETE` ke `/api/options/themes`
* **Karakter AI Pendukung**: `GET`, `POST`, `PUT`, `DELETE` ke `/api/options/characters`
* **Rotasi Groq Keys**: `GET`, `POST`, `DELETE` ke `/api/options/groq-keys`
  * Rute tambahan `POST /api/options/groq-keys/:id/reset` untuk mereset kolom `error_count` kembali ke `0`.
