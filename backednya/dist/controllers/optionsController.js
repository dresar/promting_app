"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetGroqApiKeyErrors = exports.deleteGroqApiKey = exports.createGroqApiKey = exports.getGroqApiKeys = exports.deleteDesignStyle = exports.updateDesignStyle = exports.createDesignStyle = exports.getDesignStyles = exports.deleteTargetAudience = exports.updateTargetAudience = exports.createTargetAudience = exports.getTargetAudiences = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
// --- Target Audiences ---
const getTargetAudiences = async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT id, name FROM target_audiences ORDER BY name ASC');
        return res.json(result.rows);
    }
    catch (error) {
        console.error('getTargetAudiences error:', error);
        let details = error.message || error.toString();
        if (error.errors && Array.isArray(error.errors)) {
            details += ' (' + error.errors.map((e) => e.message || e.toString()).join(', ') + ')';
        }
        return res.status(500).json({ message: 'Server error: ' + details });
    }
};
exports.getTargetAudiences = getTargetAudiences;
const createTargetAudience = async (req, res) => {
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required.' });
    try {
        const existing = await (0, db_1.query)('SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?)', [name.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
        }
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)('INSERT INTO target_audiences (id, name) VALUES (?, ?)', [id, name.trim()]);
        return res.status(201).json({ id, name: name.trim() });
    }
    catch (error) {
        console.error('createTargetAudience error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.createTargetAudience = createTargetAudience;
const updateTargetAudience = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required.' });
    try {
        const existing = await (0, db_1.query)('SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
        }
        await (0, db_1.query)('UPDATE target_audiences SET name = ? WHERE id = ?', [name.trim(), id]);
        return res.json({ id, name: name.trim() });
    }
    catch (error) {
        console.error('updateTargetAudience error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.updateTargetAudience = updateTargetAudience;
const deleteTargetAudience = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('DELETE FROM target_audiences WHERE id = ?', [id]);
        return res.json({ message: 'Target audiens berhasil dihapus.' });
    }
    catch (error) {
        console.error('deleteTargetAudience error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deleteTargetAudience = deleteTargetAudience;
// --- Design Styles ---
const getDesignStyles = async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT id, name, description, prompt, imageUrl FROM design_styles ORDER BY name ASC');
        return res.json(result.rows);
    }
    catch (error) {
        console.error('getDesignStyles error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getDesignStyles = getDesignStyles;
const createDesignStyle = async (req, res) => {
    const { name, description, prompt, imageUrl } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required.' });
    try {
        const existing = await (0, db_1.query)('SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?)', [name.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
        }
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)('INSERT INTO design_styles (id, name, description, prompt, imageUrl) VALUES (?, ?, ?, ?, ?)', [id, name.trim(), description || null, prompt || null, imageUrl || null]);
        return res.status(201).json({ id, name: name.trim(), description, prompt, imageUrl });
    }
    catch (error) {
        console.error('createDesignStyle error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.createDesignStyle = createDesignStyle;
const updateDesignStyle = async (req, res) => {
    const { id } = req.params;
    const { name, description, prompt, imageUrl } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required.' });
    try {
        const existing = await (0, db_1.query)('SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
        }
        await (0, db_1.query)('UPDATE design_styles SET name = ?, description = ?, prompt = ?, imageUrl = ? WHERE id = ?', [name.trim(), description || null, prompt || null, imageUrl || null, id]);
        return res.json({ id, name: name.trim(), description, prompt, imageUrl });
    }
    catch (error) {
        console.error('updateDesignStyle error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.updateDesignStyle = updateDesignStyle;
const deleteDesignStyle = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('DELETE FROM design_styles WHERE id = ?', [id]);
        return res.json({ message: 'Gaya desain berhasil dihapus.' });
    }
    catch (error) {
        console.error('deleteDesignStyle error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deleteDesignStyle = deleteDesignStyle;
// --- Groq API Keys ---
const getGroqApiKeys = async (req, res) => {
    try {
        const result = await (0, db_1.query)('SELECT id, api_key, is_active, error_count FROM groq_api_keys ORDER BY error_count ASC');
        const mapped = result.rows.map((row) => ({
            id: row.id,
            api_key: row.api_key,
            is_active: row.is_active === 1 || row.is_active === true || row.is_active === 'true',
            error_count: parseInt(row.error_count, 10) || 0,
        }));
        return res.json(mapped);
    }
    catch (error) {
        console.error('getGroqApiKeys error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getGroqApiKeys = getGroqApiKeys;
const createGroqApiKey = async (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey)
        return res.status(400).json({ message: 'API Key is required.' });
    try {
        const existing = await (0, db_1.query)('SELECT id FROM groq_api_keys WHERE api_key = ?', [apiKey.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: 'API Key tersebut sudah ditambahkan sebelumnya.' });
        }
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)('INSERT INTO groq_api_keys (id, api_key, is_active, error_count) VALUES (?, ?, ?, ?)', [id, apiKey.trim(), true, 0]);
        return res.status(201).json({ id, api_key: apiKey.trim(), is_active: true, error_count: 0 });
    }
    catch (error) {
        console.error('createGroqApiKey error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.createGroqApiKey = createGroqApiKey;
const deleteGroqApiKey = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('DELETE FROM groq_api_keys WHERE id = ?', [id]);
        return res.json({ message: 'API Key berhasil dihapus.' });
    }
    catch (error) {
        console.error('deleteGroqApiKey error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deleteGroqApiKey = deleteGroqApiKey;
const resetGroqApiKeyErrors = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('UPDATE groq_api_keys SET error_count = 0 WHERE id = ?', [id]);
        return res.json({ message: 'Error count berhasil direset.' });
    }
    catch (error) {
        console.error('resetGroqApiKeyErrors error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.resetGroqApiKeyErrors = resetGroqApiKeyErrors;
