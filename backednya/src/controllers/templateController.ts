import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

export const getTemplates = async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  const isPremium = req.query.isPremium as string | undefined;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: any[] = [];

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
    const templatesResult = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       ${whereClause}
       ORDER BY t.usageCount DESC, t.createdAt DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params
    );

    const countResult = await query(
      `SELECT COUNT(*) AS count FROM templates t ${whereClause}`,
      params
    );
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
      category: null,
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
  } catch (error: any) {
    console.error('getTemplates error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const searchTemplates = async (req: Request, res: Response) => {
  const searchQuery = req.query.query as string || '';
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  const searchPattern = `%${searchQuery.toLowerCase()}%`;

  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       WHERE LOWER(t.title) LIKE ? OR LOWER(t.description) LIKE ?
       ORDER BY t.usageCount DESC
       LIMIT ${limit} OFFSET ${offset}`,
      [searchPattern, searchPattern]
    );

    const countResult = await query(
      'SELECT COUNT(*) AS count FROM templates WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ?',
      [searchPattern, searchPattern]
    );
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
      category: null,
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
  } catch (error: any) {
    console.error('searchTemplates error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const getTemplateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query(
      `SELECT t.id, t.title, t.description, t.content, t.thumbnailUrl,
              t.categoryId, t.isPremium, t.usageCount, t.createdAt, t.updatedAt
       FROM templates t
       WHERE t.id = ?`,
      [id]
    );

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
      category: null,
    });
  } catch (error: any) {
    console.error('getTemplateById error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createTemplate = async (req: Request, res: Response) => {
  const { title, content, categoryId, description, thumbnailUrl } = req.body;
  if (!title || !content || !categoryId) {
    return res.status(400).json({ message: 'Title, content, and categoryId are required.' });
  }

  const templateId = uuidv4();

  try {
    await query(
      `INSERT INTO templates (id, title, description, content, thumbnailUrl, categoryId, isPremium, usageCount, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, false, 0, NOW(), NOW())`,
      [templateId, title, description || null, content, thumbnailUrl || null, categoryId]
    );

    req.params.id = templateId;
    return getTemplateById(req, res);
  } catch (error: any) {
    console.error('createTemplate error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await query('DELETE FROM templates WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    res.json({ message: 'Template berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Gagal menghapus template' });
  }
};

export const updateTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, content, thumbnailUrl, categoryId, isPremium } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title dan content diperlukan' });
  }

  try {
    const isPremiumValue = isPremium ? 1 : 0;
    const result = await query(
      'UPDATE templates SET title = ?, description = ?, content = ?, thumbnailUrl = ?, categoryId = ?, isPremium = ? WHERE id = ?',
      [title, description || null, content, thumbnailUrl || null, categoryId || null, isPremiumValue, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Template tidak ditemukan' });
    }

    res.json({ message: 'Template berhasil diperbarui', id });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Gagal memperbarui template' });
  }
};
