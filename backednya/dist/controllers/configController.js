"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSettings = exports.getUserSettings = exports.setAppConfig = exports.getAppConfig = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
// --- App Config (Global) ---
const getAppConfig = async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT `key`, `value` FROM app_config');
        const config = {};
        result.rows.forEach((row) => {
            config[row.key] = row.value;
        });
        return res.json(config);
    }
    catch (error) {
        console.error('getAppConfig error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getAppConfig = getAppConfig;
const setAppConfig = async (req, res) => {
    const { key, value } = req.body;
    if (!key || value === undefined) {
        return res.status(400).json({ message: 'Key and value are required.' });
    }
    try {
        await (0, db_1.query)(`INSERT INTO app_config (\`key\`, \`value\`, updated_at) VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW()`, [key, value]);
        return res.json({ key, value });
    }
    catch (error) {
        console.error('setAppConfig error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.setAppConfig = setAppConfig;
// --- User Settings ---
const getUserSettings = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    try {
        await (0, db_1.query)(`INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, 'SYSTEM', NOW(), NOW())
       ON DUPLICATE KEY UPDATE id=id`, [(0, uuid_1.v4)(), userId]);
        const result = await (0, db_1.query)('SELECT theme FROM settings WHERE userId = ?', [userId]);
        if (result.rows.length === 0) {
            return res.json({ theme: 'SYSTEM' });
        }
        return res.json({ theme: result.rows[0].theme || 'SYSTEM' });
    }
    catch (error) {
        console.error('getUserSettings error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getUserSettings = getUserSettings;
const updateUserSettings = async (req, res) => {
    const userId = req.user?.userId;
    const { theme } = req.body;
    if (!userId)
        return res.status(401).json({ message: 'Unauthorized' });
    if (!theme)
        return res.status(400).json({ message: 'Theme is required.' });
    try {
        await (0, db_1.query)(`INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE theme = VALUES(theme), updatedAt = NOW()`, [(0, uuid_1.v4)(), userId, theme]);
        await (0, db_1.query)('INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())', [(0, uuid_1.v4)(), userId, 'SETTINGS_UPDATED']);
        return res.json({ theme });
    }
    catch (error) {
        console.error('updateUserSettings error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.updateUserSettings = updateUserSettings;
