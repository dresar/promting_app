# 🔧 Dokumentasi Backend (API)

<div align="center">

![Backend](https://img.shields.io/badge/Backend-API_Docs-green?style=for-the-badge)

**Dokumentasi lengkap API Backend PromptStudio AI**

</div>

---

## 📋 Daftar Isi

1. [Overview](#-overview)
2. [Arsitektur Backend](#-arsitektur-backend)
3. [Setup & Konfigurasi](#-setup--konfigurasi)
4. [Authentication](#-authentication)
5. [API Endpoints](#-api-endpoints)
6. [Database Schema](#-database-schema)
7. [Error Handling](#-error-handling)
8. [Deployment](#-deployment)

---

## 🌐 Overview

Backend PromptStudio AI dibangun menggunakan **Node.js** dengan **Express** dan **TypeScript**, menyediakan RESTful API yang aman dan scalable untuk aplikasi frontend.

### Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express 4.19.2 | Web framework |
| **Language** | TypeScript 5.5.2 | Type safety |
| **Database** | MySQL 8.0 | Data storage |
| **Auth** | JWT 9.0.2 | Authentication |
| **Security** | bcrypt 5.1.1 | Password hashing |
| **File Upload** | Multer 2.1.0 | File handling |
| **Build Tool** | esbuild 0.21.5 | Fast bundling |

### Base URL

```
Development: http://localhost:3000
Production: https://promting.apprentice.cyou
Admin Panel: https://promting.apprentice.cyou/admin
```

---

## 🏗️ Arsitektur Backend

### Struktur Folder

```
backednya/
├── src/
│   ├── index.ts              # Entry point & routes
│   ├── db.ts                 # Database connection
│   ├── admin/                # Admin panel HTML
│   │   └── adminHtml.ts      # Admin dashboard template
│   ├── controllers/          # Business logic
│   │   ├── authController.ts       # Login/Register
│   │   ├── userController.ts       # User management
│   │   ├── promptController.ts     # Prompt CRUD
│   │   ├── templateController.ts   # Template management
│   │   ├── categoryController.ts   # Category management
│   │   ├── optionsController.ts    # App options
│   │   ├── configController.ts     # System config
│   │   └── uploadController.ts     # File uploads
│   ├── middleware/           # Middleware functions
│   │   └── auth.ts           # JWT authentication
│   └── utils/                # Utility functions
│       ├── pathHelper.ts     # Path utilities
│       └── assetCleanup.ts   # Asset management
├── dist/                     # Compiled output
├── .env                      # Environment variables
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

### Request Flow

```
Client Request
    ↓
CORS Middleware
    ↓
JSON Parser (50mb limit)
    ↓
Auth Middleware (if protected)
    ↓
Controller
    ↓
Database Query
    ↓
Response
```

---

## ⚙️ Setup & Konfigurasi

### Environment Variables

Buat file `.env` di root folder backend:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=promptstudio_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
```

### Install & Run

```bash
# Navigate to backend folder
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

---

## 🔐 Authentication

### Overview

Backend menggunakan **JWT (JSON Web Tokens)** untuk autentikasi. Semua endpoint yang dilindungi memerlukan header `Authorization` dengan format:

```
Authorization: Bearer <token>
```

### Token Structure

```json
{
  "userId": "uuid-string",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Auth Middleware

Middleware akan:
1. Cek keberadaan token di header
2. Verifikasi token dengan secret key
3. Attach user info ke request object
4. Lanjutkan ke controller atau return 401

---

## 📡 API Endpoints

### Base Response Format

Semua response API mengikuti format standar:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

---

### 🔑 Authentication Endpoints

#### POST `/api/auth/register`

Register user baru.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`

Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/me`

Get current user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 👤 User Endpoints

#### GET `/api/users`

Get all users (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET `/api/users/:id`

Get user by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "stats": {
      "totalPrompts": 50,
      "totalTemplates": 10,
      "totalFavorites": 25
    }
  }
}
```

#### PUT `/api/users/:id`

Update user data.

**Request Body:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

#### DELETE `/api/users/:id`

Delete user (Admin only).

---

### 📝 Prompt Endpoints

#### GET `/api/prompts`

Get all prompts (with pagination & filters).

**Query Parameters:**
```
?page=1&limit=20&category=writing&search=AI&sort=created_at&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "prompts": [
      {
        "id": "uuid",
        "title": "AI Article Writer",
        "description": "Generate articles with AI",
        "content": "Write an article about...",
        "category": "Writing",
        "tags": ["AI", "writing", "article"],
        "isFavorite": true,
        "usageCount": 150,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

#### POST `/api/prompts`

Create new prompt.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Prompt",
  "description": "Description here",
  "content": "Prompt content...",
  "categoryId": "uuid",
  "tags": ["tag1", "tag2"]
}
```

#### GET `/api/prompts/:id`

Get prompt by ID.

#### PUT `/api/prompts/:id`

Update prompt.

#### DELETE `/api/prompts/:id`

Delete prompt.

#### POST `/api/prompts/:id/favorite`

Toggle favorite status.

---

### 🎨 Template Endpoints

#### GET `/api/templates`

Get all templates.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Article Writer",
      "description": "Template for writing articles",
      "structure": "Write {{type}} about {{topic}}...",
      "variables": [
        {
          "name": "type",
          "default": "article",
          "description": "Type of content"
        },
        {
          "name": "topic",
          "default": "",
          "description": "Main topic"
        }
      ],
      "categoryId": "uuid",
      "usageCount": 250
    }
  ]
}
```

#### POST `/api/templates`

Create new template.

**Request Body:**
```json
{
  "name": "Code Generator",
  "description": "Generate code snippets",
  "structure": "Create {{language}} function that {{purpose}}",
  "variables": [
    {
      "name": "language",
      "default": "JavaScript",
      "description": "Programming language"
    },
    {
      "name": "purpose",
      "default": "",
      "description": "Function purpose"
    }
  ],
  "categoryId": "uuid"
}
```

#### PUT `/api/templates/:id`

Update template.

#### DELETE `/api/templates/:id`

Delete template.

---

### 🏷️ Category Endpoints

#### GET `/api/categories`

Get all categories.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Writing",
      "icon": "📝",
      "color": "#6366f1",
      "promptCount": 50,
      "templateCount": 10
    }
  ]
}
```

#### POST `/api/categories`

Create category (Admin).

**Request Body:**
```json
{
  "name": "New Category",
  "icon": "🎯",
  "color": "#10b981"
}
```

#### PUT `/api/categories/:id`

Update category.

#### DELETE `/api/categories/:id`

Delete category.

---

### ⚙️ Config Endpoints

#### GET `/api/config`

Get system configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "appName": "PromptStudio AI",
    "version": "1.0.0",
    "features": {
      "enableRegistration": true,
      "enableFileUpload": true,
      "maxUploadSize": 10485760
    },
    "ui": {
      "defaultTheme": "dark",
      "primaryColor": "#6366f1"
    }
  }
}
```

#### PUT `/api/config`

Update system configuration (Admin).

---

### 📁 Upload Endpoints

#### POST `/api/upload`

Upload single file.

**Headers:**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Form Data:**
```
file: <file>
```

**Response:**
```json
{
  "success": true,
  "message": "Upload successful",
  "data": {
    "filename": "abc123.png",
    "originalName": "image.png",
    "path": "/assets/uploads/abc123.png",
    "url": "http://localhost:3000/assets/uploads/abc123.png",
    "size": 102400,
    "mimetype": "image/png"
  }
}
```

#### POST `/api/upload/multiple`

Upload multiple files.

---

## 🗄️ Database Schema

### Tables Overview

```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompts table
CREATE TABLE prompts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  tags JSON,
  is_favorite BOOLEAN DEFAULT FALSE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Templates table
CREATE TABLE templates (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  category_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  structure TEXT NOT NULL,
  variables JSON,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Options table
CREATE TABLE options (
  id VARCHAR(36) PRIMARY KEY,
  key_name VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configs table
CREATE TABLE configs (
  id VARCHAR(36) PRIMARY KEY,
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT,
  config_type VARCHAR(50),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## ❌ Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

### Error Response Format

```json
{
  "success": false,
  "message": "Invalid credentials provided",
  "error": "AUTH_INVALID_CREDENTIALS",
  "details": {
    "field": "email",
    "issue": "Email format invalid"
  }
}
```

### Common Error Codes

```typescript
// Authentication errors
AUTH_TOKEN_MISSING = 'Token tidak disediakan',
AUTH_TOKEN_INVALID = 'Token tidak valid',
AUTH_TOKEN_EXPIRED = 'Token telah kadaluarsa',
AUTH_INVALID_CREDENTIALS = 'Email atau password salah',

// Validation errors
VALIDATION_ERROR = 'Data tidak valid',
REQUIRED_FIELD = 'Field wajib diisi',

// Resource errors
NOT_FOUND = 'Resource tidak ditemukan',
DUPLICATE_ENTRY = 'Data sudah ada',

// Permission errors
FORBIDDEN = 'Akses ditolak',
ADMIN_ONLY = 'Hanya admin yang dapat mengakses',
```

---

## 🚀 Deployment

### Production Build

```bash
# Build TypeScript
npm run build

# Verify build output
ls -la dist/

# Start production server
NODE_ENV=production npm start
```

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start dist/index.js --name promptstudio-api

# Auto-start on server reboot
pm2 startup
pm2 save

# Monitor application
pm2 monit

# View logs
pm2 logs promptstudio-api
```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t promptstudio-api .
docker run -p 3000:3000 --env-file .env promptstudio-api
```

### Security Best Practices

1. ✅ Use HTTPS in production
2. ✅ Set strong JWT_SECRET (min 32 chars)
3. ✅ Enable rate limiting
4. ✅ Sanitize user inputs
5. ✅ Use environment variables
6. ✅ Regular dependency updates
7. ✅ Enable CORS only for trusted origins
8. ✅ Implement request logging
9. ✅ Set up monitoring & alerts
10. ✅ Regular database backups

---

## 📊 Monitoring & Logging

### Health Check Endpoint

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "uptime": 86400,
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### Logs

Logs disimpan di console dan dapat diakses via:

```bash
# PM2 logs
pm2 logs promptstudio-api

# Docker logs
docker logs <container_id>

# Direct file (if configured)
tail -f logs/app.log
```

---

## 📞 Support

Butuh bantuan dengan API?

- 📧 GitHub Issues: [Report Issue](https://github.com/dresar/promting_app/issues)
- 📚 Documentation: [README.md](../README.md)
- 💬 Discussions: [GitHub Discussions](https://github.com/dresar/promting_app/discussions)

---

<div align="center">

**PromptStudio AI Backend API** 

Built with ❤️ using Node.js, Express & TypeScript

[⬆ Back to Top](#-daftar-isi)

</div>
