import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { authenticateToken } from './middleware/auth';
import { query } from './db';

// Import Controllers
import * as authController from './controllers/authController';
import * as userController from './controllers/userController';
import * as promptController from './controllers/promptController';
import * as optionsController from './controllers/optionsController';
import * as categoryController from './controllers/categoryController';
import * as templateController from './controllers/templateController';
import * as configController from './controllers/configController';

import { upload, uploadFile, uploadFiles } from './controllers/uploadController';

import { getAdminHtml } from './admin/adminHtml';
import { getAssetsPath } from './utils/pathHelper';
import { cleanAllUnusedAssets } from './utils/assetCleanup';

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/assets', express.static(getAssetsPath(), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
}));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Test / Dashboard Route
app.get('/', (req, res) => {
  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PromptStudio AI - Gateway Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #0b0c10;
            --card-bg: rgba(22, 26, 37, 0.6);
            --primary: #6366f1;
            --accent: #10b981;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --border: rgba(255, 255, 255, 0.08);
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent), var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 40px 20px;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            max-width: 900px;
            width: 100%;
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border);
            padding-bottom: 24px;
            margin-bottom: 32px;
        }

        .logo-area h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, #fff 30%, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .logo-area p {
            margin: 4px 0 0 0;
            color: var(--text-muted);
            font-size: 14px;
        }

        .status-badge {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(16, 185, 129, 0.1);
            color: var(--accent);
            padding: 8px 16px;
            border-radius: 100px;
            font-weight: 600;
            font-size: 13px;
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-dot {
            width: 8px;
            height: 8px;
            background: var(--accent);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        h2 {
            font-size: 18px;
            color: var(--text-main);
            margin-top: 0;
            margin-bottom: 20px;
            font-weight: 600;
        }

        .endpoint-grid {
            display: grid;
            gap: 12px;
        }

        .endpoint-card {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 16px 20px;
            transition: all 0.2s ease;
        }

        .endpoint-card:hover {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateX(4px);
        }

        .endpoint-left {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .method {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 6px;
            width: 52px;
            text-align: center;
        }

        .method.get { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.2); }
        .method.post { background: rgba(16, 185, 129, 0.1); color: var(--accent); border: 1px solid rgba(16, 185, 129, 0.2); }
        .method.put { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
        .method.delete { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

        .path {
            font-family: 'JetBrains Mono', monospace;
            color: var(--text-main);
            font-weight: 500;
            font-size: 14px;
        }

        .desc {
            color: var(--text-muted);
            font-size: 13px;
        }

        .auth-badge {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
        }

        .auth-badge.required {
            background: rgba(99, 102, 241, 0.1);
            border-color: rgba(99, 102, 241, 0.2);
            color: var(--primary);
        }

        .section-separator {
            height: 1px;
            background: var(--border);
            margin: 32px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo-area">
                <h1>PromptStudio Gateway</h1>
                <p>Gateway API Node.js TypeScript — Berjalan 24 jam</p>
            </div>
            <div class="status-badge">
                <div class="status-dot"></div>
                SYSTEM READY
            </div>
        </header>

        <div style="text-align: center; margin-bottom: 40px; background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 24px;">
            <h2 style="margin-bottom: 16px;">Kelola Data Aplikasi</h2>
            <p style="margin-bottom: 24px; font-size: 15px;">Akses Panel Admin Web untuk mengelola Kategori, Audiens, Gaya Desain, Templates, Riwayat, dan API Keys.</p>
            <a href="/admin" style="display: inline-block; background-color: var(--primary); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; transition: opacity 0.3s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1">Buka Panel Admin</a>
        </div>

        <section>
            <h2>🔑 Autentikasi (/api/auth/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/register</span>
                        <span class="desc">Daftar pengguna baru</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/login</span>
                        <span class="desc">Masuk ke aplikasi</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/auth/refresh</span>
                        <span class="desc">Perbarui access token</span>
                    </div>
                    <span class="auth-badge">Public</span>
                </div>
            </div>

            <div class="section-separator"></div>

            <h2>⚡ Prompting & AI (/api/prompt/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/prompt/generate</span>
                        <span class="desc">Buat Prompt Gambar AI dengan Groq</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method get">GET</span>
                        <span class="path">/api/prompt/history</span>
                        <span class="desc">Ambil riwayat pembuatan prompt</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method delete">DELETE</span>
                        <span class="path">/api/prompt/history/:id</span>
                        <span class="desc">Hapus riwayat prompt</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
            </div>

            <div class="section-separator"></div>

            <h2>👤 Profil Pengguna (/api/user/*)</h2>
            <div class="endpoint-grid">
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method get">GET</span>
                        <span class="path">/api/user/profile</span>
                        <span class="desc">Ambil informasi profil aktif</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method put">PUT</span>
                        <span class="path">/api/user/profile</span>
                        <span class="desc">Perbarui profil</span>
                    </div>
                    <span class="auth-badge required">Bearer Auth</span>
                </div>

            </div>
        </section>
    </div>
</body>
</html>
  `;
  res.send(htmlContent);
});


// --- Admin Web Panel ---
app.get('/admin', (req, res) => {
  res.send(getAdminHtml());
});


// --- Auth Routes ---
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/logout', authController.logout);

// --- User Routes ---
app.get('/api/user/profile', authenticateToken, userController.getProfile);
app.put('/api/user/profile', authenticateToken, userController.updateProfile);
app.put('/api/user/change-password', authenticateToken, userController.changePassword);


// --- Prompt Routes ---
app.post('/api/prompt/generate', authenticateToken, promptController.generatePrompt);
app.post('/api/prompt/generate-ad', authenticateToken, promptController.generateAdPrompt);
app.post('/api/prompt/generate-banner', authenticateToken, promptController.generateBannerPrompt);
app.post('/api/prompt/generate-logo', authenticateToken, promptController.generateLogoPrompt);
app.post('/api/prompt/generate-quote', authenticateToken, promptController.generateQuotePrompt);
app.post('/api/prompt/generate-digital-product', authenticateToken, promptController.generateDigitalProductPrompt);
app.get('/api/prompt/history/all', authenticateToken, promptController.getAllHistoryAdmin);
app.get('/api/prompt/history', authenticateToken, promptController.getPromptHistory);
app.get('/api/prompt/history/:id', authenticateToken, promptController.getPromptHistoryById);
app.put('/api/prompt/history/:id', authenticateToken, promptController.updatePromptHistory);
app.delete('/api/prompt/history/:id', authenticateToken, promptController.deletePromptHistory);
app.get('/api/prompt/favorites', authenticateToken, promptController.getFavoritePrompts);
app.post('/api/prompt/favorite/:id', authenticateToken, promptController.addFavorite);
app.delete('/api/prompt/favorite/:id', authenticateToken, promptController.removeFavorite);


// Uploads
app.post('/api/upload', authenticateToken, upload.single('file'), uploadFile);
app.post('/api/upload-multi', authenticateToken, upload.array('files', 10), uploadFiles);

// --- Options Routes ---
app.get('/api/options/audiences', optionsController.getTargetAudiences);
app.post('/api/options/audiences', authenticateToken, optionsController.createTargetAudience);
app.put('/api/options/audiences/:id', authenticateToken, optionsController.updateTargetAudience);
app.delete('/api/options/audiences/:id', authenticateToken, optionsController.deleteTargetAudience);

app.get('/api/options/styles', optionsController.getDesignStyles);
app.post('/api/options/styles', authenticateToken, optionsController.createDesignStyle);
app.put('/api/options/styles/:id', authenticateToken, optionsController.updateDesignStyle);
app.delete('/api/options/styles/:id', authenticateToken, optionsController.deleteDesignStyle);

// --- Themes Routes ---
app.get('/api/options/themes', optionsController.getThemes);
app.post('/api/options/themes', authenticateToken, optionsController.createTheme);
app.put('/api/options/themes/:id', authenticateToken, optionsController.updateTheme);
app.delete('/api/options/themes/:id', authenticateToken, optionsController.deleteTheme);

// --- Characters Routes ---
app.get('/api/options/characters', optionsController.getCharacters);
app.post('/api/options/characters', authenticateToken, optionsController.createCharacter);
app.put('/api/options/characters/:id', authenticateToken, optionsController.updateCharacter);
app.delete('/api/options/characters/:id', authenticateToken, optionsController.deleteCharacter);

app.get('/api/options/groq-keys', authenticateToken, optionsController.getGroqApiKeys);
app.post('/api/options/groq-keys', authenticateToken, optionsController.createGroqApiKey);
app.delete('/api/options/groq-keys/:id', authenticateToken, optionsController.deleteGroqApiKey);
app.post('/api/options/groq-keys/:id/reset', authenticateToken, optionsController.resetGroqApiKeyErrors);

// --- Category Routes ---
app.get('/api/categories', categoryController.getCategories);
app.post('/api/categories', authenticateToken, categoryController.createCategory);
app.put('/api/categories/:id', authenticateToken, categoryController.updateCategory);
app.delete('/api/categories/:id', authenticateToken, categoryController.deleteCategory);

// --- Template Routes ---
app.get('/api/templates', templateController.getTemplates);
app.get('/api/templates/search', templateController.searchTemplates);
app.get('/api/templates/:id', templateController.getTemplateById);
app.post('/api/templates', authenticateToken, templateController.createTemplate);
app.put('/api/templates/:id', authenticateToken, templateController.updateTemplate);
app.delete('/api/templates/:id', authenticateToken, templateController.deleteTemplate);

// --- Config / Settings Routes ---
app.get('/api/config', authenticateToken, configController.getAppConfig);
app.post('/api/config', authenticateToken, configController.setAppConfig);

app.get('/api/settings', authenticateToken, configController.getUserSettings);
app.post('/api/settings', authenticateToken, configController.updateUserSettings);

// --- Digital Product Types ---
app.get('/api/options/digital-product-types', optionsController.getDigitalProductTypes);

// Startup
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Migrate / initialize digital_product_types table in MySQL
  try {
    console.log('Initializing/Migrating digital_product_types in MySQL...');
    await query(`
      CREATE TABLE IF NOT EXISTS digital_product_types (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      )
    `);

    // Check if table is empty
    const checkEmpty = await query('SELECT COUNT(*) as count FROM digital_product_types');
    const count = checkEmpty.rows[0]?.count || 0;

    if (parseInt(count, 10) === 0) {
      console.log('Seeding default digital product types...');
      const defaultTypes = [
        'E-book / Buku Digital',
        'Online Course / Kelas Online',
        'Template Desain (Canva, Figma, dll)',
        'Preset Foto / Lightroom Preset',
        'Aplikasi / Software / SaaS',
        'Plugin / Add-on / Extension',
        'Kursus / Panduan Video',
        'Digital Art / Wallpaper',
        'Tools & Resources Pack',
        'Membership / Komunitas Digital',
      ];
      const { v4: uuidv4 } = require('uuid');
      for (const type of defaultTypes) {
        await query(
          'INSERT INTO digital_product_types (id, name) VALUES (?, ?)',
          [uuidv4(), type]
        );
      }
      console.log('Seeding digital product types completed.');
    }
  } catch (dbErr) {
    console.error('Failed to initialize digital_product_types table in MySQL:', dbErr);
  }
  
  // Run background asset cleanup
  cleanAllUnusedAssets().then((deletedCount) => {
    if (deletedCount > 0) {
      console.log(`[Asset Cleanup] Deleted ${deletedCount} unused local asset files.`);
    }
  }).catch((err) => {
    console.error('[Asset Cleanup] Failed to run startup cleanup:', err);
  });
});

