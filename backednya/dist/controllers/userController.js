"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.changePassword = exports.updateProfile = exports.getProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const db_1 = require("../db");
const https_1 = __importDefault(require("https"));
const uploadToImageKit = (fileBase64, fileName, folder) => {
    return new Promise((resolve, reject) => {
        const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || '';
        if (!privateKey) {
            return reject(new Error('ImageKit private key belum dikonfigurasi.'));
        }
        const auth = Buffer.from(privateKey + ':').toString('base64');
        const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
        let data = '';
        data += `--${boundary}\r\n`;
        data += `Content-Disposition: form-data; name="file"\r\n\r\n${fileBase64}\r\n`;
        data += `--${boundary}\r\n`;
        data += `Content-Disposition: form-data; name="fileName"\r\n\r\n${fileName}\r\n`;
        data += `--${boundary}\r\n`;
        data += `Content-Disposition: form-data; name="folder"\r\n\r\n${folder}\r\n`;
        data += `--${boundary}\r\n`;
        data += `Content-Disposition: form-data; name="useUniqueFileName"\r\n\r\ntrue\r\n`;
        data += `--${boundary}--`;
        const options = {
            hostname: 'upload.imagekit.io',
            port: 443,
            path: '/api/v2/files/upload',
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = https_1.default.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    if (res.statusCode !== 200) {
                        reject(new Error(parsed.message || 'ImageKit upload failed.'));
                    }
                    else {
                        resolve(parsed);
                    }
                }
                catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
};
const getProfile = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        const result = await (0, db_1.query)(`SELECT u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive,
              u.createdAt, u.updatedAt,
              s.theme,
              COUNT(DISTINCT ph.id) AS prompt_count,
              COUNT(DISTINCT fp.id) AS favorite_count
       FROM users u
       LEFT JOIN settings s ON s.userId = u.id
       LEFT JOIN prompt_histories ph ON ph.userId = u.id
       LEFT JOIN favorite_prompts fp ON fp.userId = u.id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive, u.createdAt, u.updatedAt, s.theme`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }
        const row = result.rows[0];
        return res.json({
            id: row.id,
            name: row.name,
            email: row.email,
            avatarUrl: row.avatarUrl,
            role: row.role || 'USER',
            isDemo: row.isDemo === 1 || row.isDemo === true,
            isActive: row.isActive === 1 || row.isActive === true,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            settings: row.theme ? { theme: row.theme } : null,
            _count: {
                promptHistories: parseInt(row.prompt_count, 10) || 0,
                favoritePrompts: parseInt(row.favorite_count, 10) || 0,
            }
        });
    }
    catch (error) {
        console.error('getProfile error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    const userId = req.user?.userId;
    const { name, avatarUrl } = req.body;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await (0, db_1.query)(`UPDATE users SET name = ?, avatarUrl = COALESCE(?, avatarUrl), updatedAt = NOW()
       WHERE id = ?`, [name, avatarUrl || null, userId]);
        await (0, db_1.query)('INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())', [(0, uuid_1.v4)(), userId, 'PROFILE_UPDATED']);
        return (0, exports.getProfile)(req, res);
    }
    catch (error) {
        console.error('updateProfile error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required.' });
    }
    try {
        const result = await (0, db_1.query)('SELECT password FROM users WHERE id = ?', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }
        const storedHash = result.rows[0].password;
        const isMatch = await bcrypt_1.default.compare(currentPassword, storedHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password saat ini tidak benar.' });
        }
        const newHash = await bcrypt_1.default.hash(newPassword, 10);
        await (0, db_1.query)('UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?', [newHash, userId]);
        await (0, db_1.query)('INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())', [(0, uuid_1.v4)(), userId, 'PASSWORD_CHANGED']);
        return res.json({ message: 'Kata sandi berhasil diubah.' });
    }
    catch (error) {
        console.error('changePassword error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.changePassword = changePassword;
const uploadAvatar = async (req, res) => {
    const userId = req.user?.userId;
    const { file, fileName } = req.body;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    if (!file || !fileName) {
        return res.status(400).json({ message: 'File (base64) and fileName are required.' });
    }
    try {
        const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
        const uniqueFileName = `avatar_${userId}_${Date.now()}.${ext}`;
        const uploadResult = await uploadToImageKit(file, uniqueFileName, '/promptstudio/avatars');
        await (0, db_1.query)('UPDATE users SET avatarUrl = ?, updatedAt = NOW() WHERE id = ?', [uploadResult.url, userId]);
        await (0, db_1.query)(`INSERT INTO uploaded_images (id, userId, url, fileId, fileName, fileType, fileSize, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, [
            (0, uuid_1.v4)(),
            userId,
            uploadResult.url,
            uploadResult.fileId,
            fileName,
            'image',
            uploadResult.size || 0,
        ]);
        await (0, db_1.query)('INSERT INTO activity_logs (id, userId, action, metadata, createdAt) VALUES (?, ?, ?, ?, NOW())', [(0, uuid_1.v4)(), userId, 'AVATAR_UPLOADED', JSON.stringify({ fileId: uploadResult.fileId })]);
        return res.json({ url: uploadResult.url });
    }
    catch (error) {
        console.error('uploadAvatar error:', error);
        return res.status(500).json({ message: 'Upload gagal: ' + (error.message || error.toString()) });
    }
};
exports.uploadAvatar = uploadAvatar;
