"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
const db_1 = require("./db");
// Import Controllers
const authController = __importStar(require("./controllers/authController"));
const userController = __importStar(require("./controllers/userController"));
const promptController = __importStar(require("./controllers/promptController"));
const optionsController = __importStar(require("./controllers/optionsController"));
const categoryController = __importStar(require("./controllers/categoryController"));
const templateController = __importStar(require("./controllers/templateController"));
const configController = __importStar(require("./controllers/configController"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, '.env') });
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
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
                <div class="endpoint-card">
                    <div class="endpoint-left">
                        <span class="method post">POST</span>
                        <span class="path">/api/user/upload-avatar</span>
                        <span class="desc">Unggah avatar dengan ImageKit</span>
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
// --- Auth Routes ---
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/refresh', authController.refresh);
app.post('/api/auth/logout', authController.logout);
// --- User Routes ---
app.get('/api/user/profile', auth_1.authenticateToken, userController.getProfile);
app.put('/api/user/profile', auth_1.authenticateToken, userController.updateProfile);
app.put('/api/user/change-password', auth_1.authenticateToken, userController.changePassword);
app.post('/api/user/upload-avatar', auth_1.authenticateToken, userController.uploadAvatar);
// --- Prompt Routes ---
app.post('/api/prompt/generate', auth_1.authenticateToken, promptController.generatePrompt);
app.get('/api/prompt/history', auth_1.authenticateToken, promptController.getPromptHistory);
app.get('/api/prompt/history/:id', auth_1.authenticateToken, promptController.getPromptHistoryById);
app.delete('/api/prompt/history/:id', auth_1.authenticateToken, promptController.deletePromptHistory);
app.get('/api/prompt/favorites', auth_1.authenticateToken, promptController.getFavoritePrompts);
app.post('/api/prompt/favorite/:id', auth_1.authenticateToken, promptController.addFavorite);
app.delete('/api/prompt/favorite/:id', auth_1.authenticateToken, promptController.removeFavorite);
// --- Options Routes ---
app.get('/api/options/audiences', optionsController.getTargetAudiences);
app.post('/api/options/audiences', auth_1.authenticateToken, optionsController.createTargetAudience);
app.put('/api/options/audiences/:id', auth_1.authenticateToken, optionsController.updateTargetAudience);
app.delete('/api/options/audiences/:id', auth_1.authenticateToken, optionsController.deleteTargetAudience);
app.get('/api/options/styles', optionsController.getDesignStyles);
app.post('/api/options/styles', auth_1.authenticateToken, optionsController.createDesignStyle);
app.put('/api/options/styles/:id', auth_1.authenticateToken, optionsController.updateDesignStyle);
app.delete('/api/options/styles/:id', auth_1.authenticateToken, optionsController.deleteDesignStyle);
app.get('/api/options/groq-keys', auth_1.authenticateToken, optionsController.getGroqApiKeys);
app.post('/api/options/groq-keys', auth_1.authenticateToken, optionsController.createGroqApiKey);
app.delete('/api/options/groq-keys/:id', auth_1.authenticateToken, optionsController.deleteGroqApiKey);
app.post('/api/options/groq-keys/:id/reset', auth_1.authenticateToken, optionsController.resetGroqApiKeyErrors);
// --- Category Routes ---
app.get('/api/categories', categoryController.getCategories);
app.post('/api/categories', auth_1.authenticateToken, categoryController.createCategory);
app.delete('/api/categories/:id', auth_1.authenticateToken, categoryController.deleteCategory);
// --- Template Routes ---
app.get('/api/templates', templateController.getTemplates);
app.get('/api/templates/search', templateController.searchTemplates);
app.get('/api/templates/:id', templateController.getTemplateById);
app.post('/api/templates', auth_1.authenticateToken, templateController.createTemplate);
app.delete('/api/templates/:id', auth_1.authenticateToken, templateController.deleteTemplate);
// --- Config / Settings Routes ---
app.get('/api/config', auth_1.authenticateToken, configController.getAppConfig);
app.post('/api/config', auth_1.authenticateToken, configController.setAppConfig);
app.get('/api/settings', auth_1.authenticateToken, configController.getUserSettings);
app.post('/api/settings', auth_1.authenticateToken, configController.updateUserSettings);
const runDbMigration = async () => {
    try {
        console.log('Running startup database check...');
        // Check and add prompt column
        const columnsResult = await (0, db_1.query)("SHOW COLUMNS FROM design_styles LIKE 'prompt'");
        if (columnsResult.rows.length === 0) {
            console.log('Adding column "prompt" to table "design_styles"...');
            await (0, db_1.query)('ALTER TABLE design_styles ADD COLUMN prompt TEXT NULL');
            console.log('Column "prompt" added successfully.');
        }
        else {
            console.log('Column "prompt" already exists in table "design_styles".');
        }
        // Check and add imageUrl column
        const imgColumnResult = await (0, db_1.query)("SHOW COLUMNS FROM design_styles LIKE 'imageUrl'");
        if (imgColumnResult.rows.length === 0) {
            console.log('Adding column "imageUrl" to table "design_styles"...');
            await (0, db_1.query)('ALTER TABLE design_styles ADD COLUMN imageUrl TEXT NULL');
            console.log('Column "imageUrl" added successfully.');
        }
        else {
            console.log('Column "imageUrl" already exists in table "design_styles".');
        }
        const styles = [
            {
                name: 'Minimalist Modern',
                description: 'Desain bersih dengan banyak ruang kosong, palet warna monokromatik, dan tipografi sans-serif.',
                prompt: 'Desain datar (2D) sederhana, bersih dengan banyak ruang kosong, palet warna minimalis (seperti putih, abu-abu muda, biru tua/navy), tipografi sans-serif bersih, tanpa objek 3D, tanpa efek 3D, ilustrasi datar bergaya flat art, rapi, minimalis modern, latar belakang bersih.',
                imageUrl: 'assets/images/styles/minimalist_modern.png'
            },
            {
                name: 'Vibrant & Bold',
                description: 'Menggunakan warna kontras yang berani, elemen grafis abstrak, dan tata letak dinamis.',
                prompt: 'Menggunakan warna kontras yang sangat berani (seperti neon, kuning menyala, merah, ungu), elemen grafis abstrak, tata letak dinamis, ilustrasi modern 2D, tipografi tebal (bold) yang mencolok, tanpa objek 3D.',
                imageUrl: 'assets/images/styles/vibrant_bold.png'
            },
            {
                name: 'Corporate Elegant',
                description: 'Gaya formal dengan warna biru/biru dongker, struktur rapi, cocok untuk presentasi bisnis.',
                prompt: 'Gaya profesional formal, warna biru navy, abu-abu, dan putih, tata letak terstruktur rapi, ikon bisnis datar, tipografi bersih, elegan dan terpercaya, tanpa objek 3D.',
                imageUrl: 'assets/images/styles/corporate_elegant.png'
            },
            {
                name: 'Playful & Colorful',
                description: 'Gaya ilustratif dengan warna-warni cerah, cocok untuk audiens muda atau edukatif.',
                prompt: 'Gaya ilustratif kartun 2D yang ceria, warna-warni cerah dan hangat, cocok untuk anak-anak atau audiens muda, ikon lucu, tipografi ramah dan mudah dibaca, tanpa objek 3D.',
                imageUrl: 'assets/images/styles/playful_colorful.png'
            },
            {
                name: 'Retro Vintage',
                description: 'Estetika klasik 90-an dengan tekstur kertas grain, warna pastel pop, dan font serif klasik.',
                prompt: 'Estetika klasik tahun 90-an (90s retro), tekstur kertas grain/grunge halus, palet warna pastel pop hangat yang pudar, tipografi serif klasik yang elegan, gaya ilustrasi datar retro, tanpa objek 3D.',
                imageUrl: 'assets/images/styles/retro_vintage.png'
            },
            {
                name: 'Cyberpunk',
                description: 'Tema futuristik gelap dengan aksen neon menyala (cyan, pink) dan elemen garis grid teknologi.',
                prompt: 'Tema futuristik gelap (dark cyberpunk style), latar belakang hitam/abu-abu sangat gelap, aksen lampu neon menyala terang berwarna cyan, pink, dan ungu, elemen garis grid teknologi, ilustrasi HUD digital futuristik 2D.',
                imageUrl: 'assets/images/styles/cyberpunk.png'
            },
            {
                name: 'Neo-Brutalist',
                description: 'Desain dengan border hitam tebal, warna flat kontras, box teks bertumpuk, dan tata letak asimetris.',
                prompt: 'Desain neo-brutalisme, garis tepi (border) hitam tebal dan tegas, warna datar (flat colors) kontras tinggi yang mentah, kotak teks bertumpuk (shadow box offset), tata letak asimetris yang berani, tanpa gradasi, tanpa 3D.',
                imageUrl: 'assets/images/styles/neobrutalist.png'
            },
            {
                name: 'Soft Pastel Dream',
                description: 'Gaya lembut dengan gradasi pastel halus (lavender, mint, cream) dan bentuk bulat yang menenangkan.',
                prompt: 'Gaya visual lembut menenangkan, gradasi warna pastel halus (seperti lavender, mint, cream, peach), bentuk geometris bulat dengan sudut melengkung halus (rounded shapes), tipografi sans-serif minimalis, bersih dan bersih, tanpa efek kasar.',
                imageUrl: 'assets/images/styles/pastel_dream.png'
            },
            {
                name: 'Hand-Drawn Sketch',
                description: 'Desain doodle sketsa tangan artistik dengan garis tinta hitam dan sapuan warna marker organik.',
                prompt: 'Ilustrasi sketsa tangan artistik (hand-drawn doodle art), garis luar (outline) tinta hitam organik, sapuan warna marker air (watercolor/marker wash) yang tidak rapi secara sengaja, tipografi bergaya tulisan tangan yang kasual.',
                imageUrl: 'assets/images/styles/handdrawn_sketch.png'
            },
            {
                name: 'Geometric Abstract',
                description: 'Gaya seni abstrak Swiss dengan perpaduan lingkaran, segitiga, dan tata letak grid presisi.',
                prompt: 'Seni abstrak geometris (Swiss design style), perpaduan bentuk lingkaran, segitiga, dan persegi, tata letak grid presisi tinggi, warna solid kontras tinggi, tipografi sans-serif tebal (bold), tanpa gradasi.',
                imageUrl: 'assets/images/styles/geometric_abstract.png'
            },
            {
                name: 'Infographic Minimalist',
                description: 'Tata letak visual untuk menyajikan data dengan diagram bersih, timeline, dan fokus kontras tinggi.',
                prompt: 'Tata letak infografis minimalis terstruktur, diagram dan bagan bersih, garis waktu (timeline) sederhana, ikon data datar (2D), fokus pada keterbacaan informasi tinggi, warna latar belakang bersih (light background).',
                imageUrl: 'assets/images/styles/infographic_minimalist.png'
            },
            {
                name: 'Manga / Comic Art',
                description: 'Desain komik hitam putih bergaya Jepang dengan speed lines, tekstur dot halftone, dan panel komik.',
                prompt: 'Seni komik manga hitam putih (Japanese manga style), menggunakan tekstur dot halftone untuk bayangan, garis aksi (speed lines), garis luar tinta hitam tebal, pembagian panel komik, tipografi komik ekspresif.',
                imageUrl: 'assets/images/styles/manga_comic.png'
            },
            {
                name: 'Techno Sci-Fi',
                description: 'Antarmuka futuristik dengan bingkai UI berpola, HUD biru bercahaya, dan font digital teknis.',
                prompt: 'Desain antarmuka fiksi ilmiah (Sci-Fi HUD), latar belakang gelap, bingkai UI berpola sirkuit, elemen indikator bercahaya biru/cyan, tipografi digital teknis, diagram radar 2D datar.',
                imageUrl: 'assets/images/styles/techno_scifi.png'
            },
            {
                name: 'Glassmorphism Elegant',
                description: 'Efek kartu kaca transparan blur di atas gradien warna premium, tipografi modern berkelas.',
                prompt: 'Desain glassmorphism elegan, kartu overlay kaca transparan dengan efek buram (frosted glass blur), bayangan halus di belakang kartu, latar belakang gradien warna premium yang dinamis, tipografi sans-serif modern berkelas.',
                imageUrl: 'assets/images/styles/glassmorphism_elegant.png'
            },
            {
                name: 'Organic Nature',
                description: 'Warna bumi hangat (terracotta, olive) yang menenangkan dikombinasikan sketsa daun/bunga dan font serif.',
                prompt: 'Desain organik estetika alam (nature botanical), warna bumi hangat yang menenangkan (terracotta, olive green, beige, mustard), sketsa garis tanaman daun dan bunga yang elegan, tipografi serif klasik yang artistik.',
                imageUrl: 'assets/images/styles/botanical_organic.png'
            }
        ];
        for (const style of styles) {
            const existing = await (0, db_1.query)('SELECT id FROM design_styles WHERE name = ?', [style.name]);
            if (existing.rows.length > 0) {
                await (0, db_1.query)('UPDATE design_styles SET description = ?, prompt = ?, imageUrl = ? WHERE name = ?', [style.description, style.prompt, style.imageUrl, style.name]);
            }
        }
        console.log('Startup database check complete.');
    }
    catch (err) {
        console.error('Database startup migration failed:', err);
    }
};
// Startup
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await runDbMigration();
});
