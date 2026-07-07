"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavoritePrompts = exports.deletePromptHistory = exports.getPromptHistoryById = exports.getPromptHistory = exports.generatePrompt = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const https_1 = __importDefault(require("https"));
// --- Groq Integration Logic ---
const getGroqApiKey = async () => {
    try {
        const result = await (0, db_1.query)(`
      SELECT api_key FROM groq_api_keys
      WHERE is_active = 1 OR is_active = true
      ORDER BY error_count ASC, last_used_at ASC
      LIMIT 1
    `);
        if (result.rows.length > 0) {
            const bestKey = result.rows[0].api_key;
            await (0, db_1.query)('UPDATE groq_api_keys SET last_used_at = NOW() WHERE api_key = ?', [bestKey]);
            return bestKey;
        }
    }
    catch (e) {
        console.error('Gagal mengambil groq_api_keys:', e);
    }
    try {
        const fallback = await (0, db_1.query)("SELECT value FROM app_config WHERE `key` = 'groq_api_key'");
        if (fallback.rows.length > 0) {
            return fallback.rows[0].value;
        }
    }
    catch (_) { }
    return '';
};
const markGroqApiKeyFailed = async (apiKey) => {
    try {
        await (0, db_1.query)('UPDATE groq_api_keys SET error_count = error_count + 1 WHERE api_key = ?', [apiKey]);
    }
    catch (e) {
        console.error('Gagal update error_count:', e);
    }
};
const callGroqApiWithRotation = (promptInstruction) => {
    return new Promise(async (resolve, reject) => {
        let result = null;
        let retryCount = 0;
        while (retryCount < 3 && result === null) {
            const apiKey = await getGroqApiKey();
            if (!apiKey || apiKey.startsWith('gsk_YOUR_GROQ_API_KEY')) {
                return reject(new Error('Groq API Key belum dikonfigurasi di database.'));
            }
            try {
                const payload = JSON.stringify({
                    model: 'llama-3.1-8b-instant',
                    messages: [{ role: 'user', content: promptInstruction }],
                    temperature: 0.7,
                });
                const options = {
                    hostname: 'api.groq.com',
                    port: 443,
                    path: '/openai/v1/chat/completions',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload),
                    },
                    timeout: 15000,
                };
                const resPromise = new Promise((resResolve, resReject) => {
                    const req = https_1.default.request(options, (res) => {
                        let body = '';
                        res.on('data', (chunk) => body += chunk);
                        res.on('end', () => resResolve({ statusCode: res.statusCode, body }));
                    });
                    req.on('timeout', () => {
                        req.destroy();
                        resReject(new Error('Request Timeout'));
                    });
                    req.on('error', (err) => resReject(err));
                    req.write(payload);
                    req.end();
                });
                const response = await resPromise;
                if (response.statusCode === 200) {
                    const data = JSON.parse(response.body);
                    result = data.choices[0].message.content;
                }
                else {
                    await markGroqApiKeyFailed(apiKey);
                    retryCount++;
                    await new Promise((r) => setTimeout(r, 1000));
                }
            }
            catch (e) {
                await markGroqApiKeyFailed(apiKey);
                retryCount++;
                await new Promise((r) => setTimeout(r, 1000));
            }
        }
        if (result) {
            resolve(result);
        }
        else {
            reject(new Error('Gagal memanggil Groq API setelah rotasi key.'));
        }
    });
};
const buildPromptFallback = (title, contentType, slideCount, designStyle, targetAudience) => {
    const slides = Array.from({ length: slideCount }, (_, i) => {
        const n = i + 1;
        if (n === 1) {
            return `Slide ${n}: Cover — Judul utama "${title}", subtitle yang menarik, dan visual hero yang relevan dengan gaya ${designStyle}.`;
        }
        if (n === slideCount) {
            return `Slide ${n}: Penutup & Call to Action — Ringkasan poin utama, ajakan bertindak yang kuat, dan informasi kontak.`;
        }
        return `Slide ${n}: Poin Utama ${n - 1} — Konten inti yang relevan dengan "${title}" untuk audiens ${targetAudience}, disajikan secara visual dengan gaya ${designStyle}.`;
    }).join('\n');
    return `[PROMPT GENERATED — PromptStudio AI]\n\n` +
        `Buat presentasi ${contentType} dengan judul: "${title}"\n\n` +
        `Target Audiens: ${targetAudience}\n` +
        `Gaya Desain: ${designStyle}\n` +
        `Jumlah Slide: ${slideCount}\n\n` +
        `${slides}\n\n` +
        `[Catatan: Setiap slide harus memiliki visual yang menarik, teks singkat, dan pesan yang jelas sesuai gaya ${designStyle}.]`;
};
// --- Controllers ---
const generatePrompt = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const { title, contentType, slideCount, designStyle, targetAudience } = req.body;
    if (!title || !contentType || !slideCount || !designStyle || !targetAudience) {
        return res.status(400).json({ message: 'Missing required parameters.' });
    }
    let generatedPrompt = '';
    try {
        let stylePrompt = '';
        try {
            const styleName = designStyle.split('|')[0].trim();
            const styleRows = await (0, db_1.query)('SELECT prompt FROM design_styles WHERE name = ?', [styleName]);
            if (styleRows.rows && styleRows.rows.length > 0) {
                stylePrompt = styleRows.rows[0].prompt || '';
            }
        }
        catch (dbErr) {
            console.warn('Failed to fetch style prompt from DB:', dbErr);
        }
        const setupInstruction = `Kamu adalah seorang Profesional Desain Grafis dan Ahli Prompt Engineer (Midjourney/DALL-E).
Saya ingin membuat desain "${contentType}" dengan topik "${title}" untuk audiens "${targetAudience}".
Gaya desain visual yang diinginkan adalah: ${designStyle}.
${stylePrompt ? `Gunakan panduan instruksi visual detail berikut untuk gaya desain tersebut:\n"${stylePrompt}"\n` : ''}

Tugas pertama: Buatlah SATU paragraf "Konsep Desain Visual Utama" yang SUPER DETAIL.
Konsep ini harus mencakup: palet warna, pencahayaan, gaya ilustrasi/fotografi, tekstur, mood, dan komposisi artistik.
JANGAN BUAT teks konten slide, HANYA konsep visual utamanya saja yang konsisten untuk semua slide.`;
        let mainVisualConcept = '';
        try {
            mainVisualConcept = await callGroqApiWithRotation(setupInstruction);
        }
        catch (e) {
            console.warn('Groq visual concept failed, using fallback:', e);
            mainVisualConcept = `Gunakan gaya visual: ${designStyle} dengan kualitas fotorealistik/artistik tinggi dan komposisi profesional.`;
        }
        const finalPromptParts = [];
        for (let i = 1; i <= slideCount; i++) {
            let promptInstruction = '';
            if (i === 1) {
                promptInstruction = `Kamu adalah Profesional Desain Grafis. Buatlah prompt AI Image Generation untuk SLIDE 1 (Cover/Hook).

Konsep Visual Utama yang HARUS selalu diterapkan pada prompt gambar ini:
"${mainVisualConcept}"

Instruksi Khusus Slide 1:
1. Buat teks overlay (Headline) yang bertindak sebagai HOOK. Sangat memancing rasa penasaran, bahasa kasual (non-formal), singkat dan padat.
2. Deskripsikan ilustrasi gambar yang sesuai dengan headline ini dan menyatu sempurna dengan Konsep Visual Utama di atas.
3. Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
   - Di pojok kiri atas gambar, buat sebuah overlay kotak berwarna biru dan tampilkan teks nomor halaman/slide saat ini: "1/${slideCount}".
   - Di pojok kanan atas gambar, buat sebuah overlay dengan warna tersendiri yang konsisten dan tampilkan teks ajakan follow yang manis: "Jangan lupa follow!".
   - Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan informasi sosial media dengan ikon/logo grafis saja tanpa label teks pengantar:
     * Tampilkan ikon/logo Instagram diikuti langsung oleh nama pengguna "arif_ex21" (tanpa kata "Logo" atau "Instagram" di depan).
     * Tampilkan ikon/logo Web/Globe diikuti langsung oleh link website "https://www.inka.my.id/" (tanpa kata "Web" di depan).
     * Tampilkan ikon/logo GitHub diikuti langsung oleh link GitHub "github.com/dresar" (tanpa kata "GitHub" di depan).
4. Sertakan juga bagian "Negative Prompt" yang super lengkap dan sangat mendetail (misalnya untuk menghindari teks berantakan, watermark, anatomi aneh, kualitas buruk, dsb).

Format output: Awali HANYA dengan "--- Slide 1 ---" di baris pertama. Kemudian gabungkan ilustrasi spesifik slide ini dengan konsep visual utama, layout teks, serta negative prompt menjadi sebuah instruksi prompt bahasa Indonesia yang utuh dan sangat mendetail. Jangan sertakan teks pengantar apapun.`;
            }
            else {
                promptInstruction = `Kamu adalah Profesional Desain Grafis. Buatlah prompt AI Image Generation untuk SLIDE ${i} dari total ${slideCount} slide.

Konsep Visual Utama yang HARUS selalu diterapkan pada prompt gambar ini:
"${mainVisualConcept}"

Instruksi Khusus Slide ${i}:
1. Buat teks overlay (Isi Konten) yang melanjutkan alur logika topik "${title}". Jelaskan secara ringan, kasual, tidak kaku, namun sangat mudah dipahami. Teks jangan terlalu panjang.
2. Deskripsikan ilustrasi gambar yang merepresentasikan teks konten tersebut dan menyatu sempurna dengan Konsep Visual Utama di atas.
3. Tambahkan layout visual dan teks detail berikut pada gambar secara profesional:
   - Di pojok kiri atas gambar, buat sebuah overlay kotak berwarna biru dan tampilkan teks nomor halaman/slide saat ini: "${i}/${slideCount}".
   - Di pojok kanan atas gambar, buat sebuah overlay dengan warna tersendiri yang konsisten dan tampilkan teks ajakan follow yang manis: "Jangan lupa follow!".
   - Di bagian footer paling bawah gambar secara terpusat/minimalis, tampilkan informasi sosial media dengan ikon/logo grafis saja tanpa label teks pengantar:
     * Tampilkan ikon/logo Instagram diikuti langsung oleh nama pengguna "arif_ex21" (tanpa kata "Logo" atau "Instagram" di depan).
     * Tampilkan ikon/logo Web/Globe diikuti langsung oleh link website "https://www.inka.my.id/" (tanpa kata "Web" di depan).
     * Tampilkan ikon/logo GitHub diikuti langsung oleh link GitHub "github.com/dresar" (tanpa kata "GitHub" di depan).
4. Sertakan juga bagian "Negative Prompt" yang super lengkap dan sangat mendetail (misalnya untuk menghindari teks berantakan, watermark, anatomi aneh, kualitas buruk, dsb).

Format output: Awali HANYA dengan "--- Slide ${i} ---" di baris pertama. Kemudian gabungkan ilustrasi spesifik slide ini dengan konsep visual utama, layout teks, serta negative prompt menjadi sebuah instruksi prompt bahasa Indonesia yang utuh dan sangat mendetail. Jangan sertakan teks pengantar apapun.`;
            }
            try {
                const slideResult = await callGroqApiWithRotation(promptInstruction);
                if (slideResult) {
                    const cleanSlide = slideResult.trim().replace(/^---\s*Slide\s+\d+\s*---\s*/m, '');
                    finalPromptParts.push(`--- Slide ${i} ---\n${cleanSlide}`);
                }
                else {
                    finalPromptParts.push(`--- Slide ${i} ---\n[Gagal meng-generate konten untuk slide ini]`);
                }
            }
            catch (e) {
                console.error(`Slide ${i} generation failed:`, e);
                finalPromptParts.push(`--- Slide ${i} ---\n[Gagal meng-generate konten untuk slide ini karena limit API/jaringan]`);
            }
        }
        generatedPrompt = finalPromptParts.join('\n\n');
    }
    catch (err) {
        console.error('Groq generation error, falling back to local prompt builder:', err);
        generatedPrompt = buildPromptFallback(title, contentType, slideCount, designStyle, targetAudience);
    }
    const historyId = (0, uuid_1.v4)();
    try {
        await (0, db_1.query)(`INSERT INTO prompt_histories (id, userId, title, contentType, slideCount, designStyle, targetAudience, language, generatedPrompt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ID', ?, NOW(), NOW())`, [historyId, userId, title, contentType, slideCount, designStyle, targetAudience, generatedPrompt]);
        await (0, db_1.query)('INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())', [(0, uuid_1.v4)(), userId, 'PROMPT_GENERATED', JSON.stringify({ historyId })]);
        return res.status(201).json({
            id: historyId,
            userId,
            title,
            contentType,
            slideCount,
            designStyle,
            targetAudience,
            language: 'ID',
            generatedPrompt,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
        });
    }
    catch (error) {
        console.error('Save prompt history error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.generatePrompt = generatePrompt;
const getPromptHistory = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const offset = (page - 1) * limit;
    try {
        const result = await (0, db_1.query)(`SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.createdAt, ph.updatedAt,
              fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.userId = ?
       ORDER BY ph.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`, [userId, userId]);
        const countResult = await (0, db_1.query)('SELECT COUNT(*) AS count FROM prompt_histories WHERE userId = ?', [userId]);
        const total = parseInt(countResult.rows[0].count, 10) || 0;
        const histories = result.rows.map((row) => ({
            id: row.id,
            userId: row.userId,
            title: row.title,
            contentType: row.contentType,
            slideCount: row.slideCount || 1,
            designStyle: row.designStyle,
            targetAudience: row.targetAudience,
            language: row.language || 'ID',
            generatedPrompt: row.generatedPrompt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            isFavorite: row.favorite_id !== null,
        }));
        return res.json({
            histories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('getPromptHistory error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getPromptHistory = getPromptHistory;
const getPromptHistoryById = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const result = await (0, db_1.query)(`SELECT ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.createdAt, ph.updatedAt, fp.id AS favorite_id
       FROM prompt_histories ph
       LEFT JOIN favorite_prompts fp ON fp.promptHistoryId = ph.id AND fp.userId = ?
       WHERE ph.id = ? AND ph.userId = ?`, [userId, id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
        }
        const row = result.rows[0];
        return res.json({
            id: row.id,
            userId: row.userId,
            title: row.title,
            contentType: row.contentType,
            slideCount: row.slideCount || 1,
            designStyle: row.designStyle,
            targetAudience: row.targetAudience,
            language: row.language || 'ID',
            generatedPrompt: row.generatedPrompt,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            isFavorite: row.favorite_id !== null,
        });
    }
    catch (error) {
        console.error('getPromptHistoryById error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getPromptHistoryById = getPromptHistoryById;
const deletePromptHistory = async (req, res) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const check = await (0, db_1.query)('SELECT id FROM prompt_histories WHERE id = ? AND userId = ?', [id, userId]);
        if (check.rows.length === 0) {
            return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
        }
        await (0, db_1.query)('DELETE FROM favorite_prompts WHERE promptHistoryId = ?', [id]);
        await (0, db_1.query)('DELETE FROM prompt_histories WHERE id = ?', [id]);
        return res.json({ message: 'Prompt history berhasil dihapus.' });
    }
    catch (error) {
        console.error('deletePromptHistory error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deletePromptHistory = deletePromptHistory;
const getFavoritePrompts = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const page = parseInt(req.query.page || '1', 10) || 1;
    const limit = parseInt(req.query.limit || '10', 10) || 10;
    const offset = (page - 1) * limit;
    try {
        const result = await (0, db_1.query)(`SELECT fp.id AS fav_id, fp.userId AS fav_userId, fp.promptHistoryId AS fav_historyId, fp.createdAt AS fav_createdAt,
              ph.id, ph.userId, ph.title, ph.contentType, ph.slideCount,
              ph.designStyle, ph.targetAudience, ph.language, ph.generatedPrompt,
              ph.createdAt AS ph_createdAt, ph.updatedAt AS ph_updatedAt
       FROM favorite_prompts fp
       JOIN prompt_histories ph ON ph.id = fp.promptHistoryId
       WHERE fp.userId = ?
       ORDER BY fp.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`, [userId]);
        const countResult = await (0, db_1.query)('SELECT COUNT(*) AS count FROM favorite_prompts WHERE userId = ?', [userId]);
        const total = parseInt(countResult.rows[0].count, 10) || 0;
        const favorites = result.rows.map((row) => ({
            id: row.fav_id,
            userId: row.fav_userId,
            promptHistoryId: row.fav_historyId,
            createdAt: row.fav_createdAt,
            promptHistory: {
                id: row.id,
                userId: row.userId,
                title: row.title,
                contentType: row.contentType,
                slideCount: row.slideCount || 1,
                designStyle: row.designStyle,
                targetAudience: row.targetAudience,
                language: row.language || 'ID',
                generatedPrompt: row.generatedPrompt,
                createdAt: row.ph_createdAt,
                updatedAt: row.ph_updatedAt,
                isFavorite: true,
            },
        }));
        return res.json({
            favorites,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('getFavoritePrompts error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getFavoritePrompts = getFavoritePrompts;
const addFavorite = async (req, res) => {
    const userId = req.user?.userId;
    const { id: promptHistoryId } = req.params;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const checkHist = await (0, db_1.query)('SELECT id FROM prompt_histories WHERE id = ? AND userId = ?', [promptHistoryId, userId]);
        if (checkHist.rows.length === 0) {
            return res.status(404).json({ message: 'Prompt history tidak ditemukan.' });
        }
        const checkFav = await (0, db_1.query)('SELECT id FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?', [promptHistoryId, userId]);
        if (checkFav.rows.length > 0) {
            return res.status(409).json({ message: 'Prompt sudah ada di favorites.' });
        }
        const favoriteId = (0, uuid_1.v4)();
        await (0, db_1.query)('INSERT INTO favorite_prompts (id, userId, promptHistoryId, createdAt) VALUES (?, ?, ?, NOW())', [favoriteId, userId, promptHistoryId]);
        return res.status(201).json({
            id: favoriteId,
            userId,
            promptHistoryId,
            createdAt: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('addFavorite error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.addFavorite = addFavorite;
const removeFavorite = async (req, res) => {
    const userId = req.user?.userId;
    const { id: promptHistoryId } = req.params;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await (0, db_1.query)('DELETE FROM favorite_prompts WHERE promptHistoryId = ? AND userId = ?', [promptHistoryId, userId]);
        return res.json({ message: 'Prompt berhasil dihapus dari favorites.' });
    }
    catch (error) {
        console.error('removeFavorite error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.removeFavorite = removeFavorite;
