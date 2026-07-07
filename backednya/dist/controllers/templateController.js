"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplate = exports.createTemplate = exports.getTemplateById = exports.searchTemplates = exports.getTemplates = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const getTemplates = async (req, res) => {
    const categoryId = req.query.categoryId;
    const isPremium = req.query.isPremium;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    if (categoryId) {
        conditions.push('t.categoryId = ?');
        params.push(categoryId);
    }
    if (isPremium !== undefined) {
        const isPremiumBool = isPremium === 'true';
        conditions.push('t.isPremium = ?');
        params.push(isPremiumBool ? 1 : 0);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    try {
        const templatesResult = await (0, db_1.query)(`SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt,
              c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon AS cat_icon, c.color AS cat_color
       FROM templates t
       LEFT JOIN categories c ON c.id = t.categoryId
       ${whereClause}
       ORDER BY t.usageCount DESC, t.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`, params);
        const countResult = await (0, db_1.query)(`SELECT COUNT(*) AS count FROM templates t ${whereClause}`, params);
        const total = parseInt(countResult.rows[0].count, 10) || 0;
        const templates = templatesResult.rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            content: row.content,
            thumbnailUrl: row.thumbnailUrl,
            categoryId: row.categoryId,
            isPremium: row.isPremium === 1 || row.isPremium === true,
            usageCount: row.usageCount || 0,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            category: row.cat_id ? {
                id: row.cat_id,
                name: row.cat_name,
                slug: row.cat_slug,
                icon: row.cat_icon,
                color: row.cat_color,
                templatesCount: 0,
            } : null,
        }));
        return res.json({
            templates,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('getTemplates error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getTemplates = getTemplates;
const searchTemplates = async (req, res) => {
    const searchQuery = req.query.query || '';
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const searchPattern = `%${searchQuery.toLowerCase()}%`;
    try {
        const result = await (0, db_1.query)(`SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt,
              c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon AS cat_icon, c.color AS cat_color
       FROM templates t
       LEFT JOIN categories c ON c.id = t.categoryId
       WHERE LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ?
       ORDER BY t.usageCount DESC
       LIMIT ${limit} OFFSET ${offset}`, [searchPattern, searchPattern]);
        const countResult = await (0, db_1.query)('SELECT COUNT(*) AS count FROM templates WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?', [searchPattern, searchPattern]);
        const total = parseInt(countResult.rows[0].count, 10) || 0;
        const templates = result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            description: row.description,
            content: row.content,
            thumbnailUrl: row.thumbnailUrl,
            categoryId: row.categoryId,
            isPremium: row.isPremium === 1 || row.isPremium === true,
            usageCount: row.usageCount || 0,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            category: row.cat_id ? {
                id: row.cat_id,
                name: row.cat_name,
                slug: row.cat_slug,
                icon: row.cat_icon,
                color: row.cat_color,
                templatesCount: 0,
            } : null,
        }));
        return res.json({
            templates,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error('searchTemplates error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.searchTemplates = searchTemplates;
const getTemplateById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await (0, db_1.query)(`SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt,
              c.id AS cat_id, c.name AS cat_name, c.slug AS cat_slug, c.icon AS cat_icon, c.color AS cat_color
       FROM templates t
       LEFT JOIN categories c ON c.id = t.categoryId
       WHERE t.id = ?`, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Template tidak ditemukan.' });
        }
        const row = result.rows[0];
        return res.json({
            id: row.id,
            title: row.title,
            description: row.description,
            content: row.content,
            thumbnailUrl: row.thumbnailUrl,
            categoryId: row.categoryId,
            isPremium: row.isPremium === 1 || row.isPremium === true,
            usageCount: row.usageCount || 0,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            category: row.cat_id ? {
                id: row.cat_id,
                name: row.cat_name,
                slug: row.cat_slug,
                icon: row.cat_icon,
                color: row.cat_color,
                templatesCount: 0,
            } : null,
        });
    }
    catch (error) {
        console.error('getTemplateById error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getTemplateById = getTemplateById;
const createTemplate = async (req, res) => {
    const { title, content, categoryId, description, thumbnailUrl } = req.body;
    if (!title || !content || !categoryId) {
        return res.status(400).json({ message: 'Title, content, and categoryId are required.' });
    }
    const templateId = (0, uuid_1.v4)();
    try {
        await (0, db_1.query)(`INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, false, 0, NOW(), NOW())`, [templateId, title, description || null, content, thumbnailUrl || null, categoryId]);
        return (0, exports.getTemplateById)(req, res);
    }
    catch (error) {
        console.error('createTemplate error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.createTemplate = createTemplate;
const deleteTemplate = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('DELETE FROM templates WHERE id = ?', [id]);
        return res.json({ message: 'Template berhasil dihapus.' });
    }
    catch (error) {
        console.error('deleteTemplate error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deleteTemplate = deleteTemplate;
