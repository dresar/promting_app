import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT c.id, c.name, c.slug, c.icon, c.color,
              COUNT(t.id) AS templates_count
       FROM categories c
       LEFT JOIN templates t ON t.categoryId = c.id
       GROUP BY c.id, c.name, c.slug, c.icon, c.color
       ORDER BY c.name ASC`
    );

    const categories = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      color: row.color,
      templatesCount: parseInt(row.templates_count, 10) || 0,
    }));

    return res.json(categories);
  } catch (error: any) {
    console.error('getCategories error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const existing = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Kategori "${name}" sudah ada.` });
    }

    const id = uuidv4();
    await query(
      'INSERT INTO categories (id, name, slug, icon, color) VALUES (?, ?, ?, ?, ?)',
      [id, name.trim(), slug, icon || 'folder', color || '#6366F1']
    );

    return res.status(201).json({ id, name: name.trim(), slug, icon: icon || 'folder', color: color || '#6366F1' });
  } catch (error: any) {
    console.error('createCategory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, icon, color } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const existing = await query('SELECT id FROM categories WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Kategori "${name}" sudah ada.` });
    }

    await query(
      'UPDATE categories SET name = ?, slug = ?, icon = ?, color = ? WHERE id = ?',
      [name.trim(), slug, icon || 'folder', color || '#6366F1', id]
    );

    return res.json({ id, name: name.trim(), slug, icon: icon || 'folder', color: color || '#6366F1' });
  } catch (error: any) {
    console.error('updateCategory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM categories WHERE id = ?', [id]);
    return res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteCategory error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
