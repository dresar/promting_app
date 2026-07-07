"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.createCategory = exports.getCategories = void 0;
const uuid_1 = require("uuid");
const db_1 = require("../db");
const getCategories = async (req, res) => {
    try {
        const result = await (0, db_1.query)(`SELECT c.id, c.name, c.slug, c.icon, c.color,
              COUNT(t.id) AS templates_count
       FROM categories c
       LEFT JOIN templates t ON t.categoryId = c.id
       GROUP BY c.id, c.name, c.slug, c.icon, c.color
       ORDER BY c.name ASC`);
        const categories = result.rows.map((row) => ({
            id: row.id,
            name: row.name,
            slug: row.slug,
            icon: row.icon,
            color: row.color,
            templatesCount: parseInt(row.templates_count, 10) || 0,
        }));
        return res.json(categories);
    }
    catch (error) {
        console.error('getCategories error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    const { name, icon, color } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name is required.' });
    try {
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const existing = await (0, db_1.query)('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name.trim()]);
        if (existing.rows.length > 0) {
            return res.status(409).json({ message: `Kategori "${name}" sudah ada.` });
        }
        const id = (0, uuid_1.v4)();
        await (0, db_1.query)('INSERT INTO categories (id, name, slug, icon, color) VALUES (?, ?, ?, ?, ?)', [id, name.trim(), slug, icon || 'folder', color || '#6366F1']);
        return res.status(201).json({ id, name: name.trim(), slug, icon: icon || 'folder', color: color || '#6366F1' });
    }
    catch (error) {
        console.error('createCategory error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.createCategory = createCategory;
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await (0, db_1.query)('DELETE FROM categories WHERE id = ?', [id]);
        return res.json({ message: 'Kategori berhasil dihapus.' });
    }
    catch (error) {
        console.error('deleteCategory error:', error);
        return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
    }
};
exports.deleteCategory = deleteCategory;
