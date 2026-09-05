import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';
import fs from 'fs';
import path from 'path';
import { getAssetsPath } from '../utils/pathHelper';
import { cleanUnusedAsset } from '../utils/assetCleanup';

// --- Target Audiences ---

export const getTargetAudiences = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name FROM target_audiences ORDER BY name ASC');
    return res.json(result.rows);
  } catch (error: any) {
    console.error('getTargetAudiences error:', error);
    let details = error.message || error.toString();
    if (error.errors && Array.isArray(error.errors)) {
      details += ' (' + error.errors.map((e: any) => e.message || e.toString()).join(', ') + ')';
    }
    return res.status(500).json({ message: 'Server error: ' + details });
  }
};

export const createTargetAudience = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const existing = await query('SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
    }

    const id = uuidv4();
    await query('INSERT INTO target_audiences (id, name) VALUES (?, ?)', [id, name.trim()]);
    return res.status(201).json({ id, name: name.trim() });
  } catch (error: any) {
    console.error('createTargetAudience error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateTargetAudience = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const existing = await query('SELECT id FROM target_audiences WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Target Audiens "${name}" sudah ada.` });
    }

    await query('UPDATE target_audiences SET name = ? WHERE id = ?', [name.trim(), id]);
    return res.json({ id, name: name.trim() });
  } catch (error: any) {
    console.error('updateTargetAudience error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteTargetAudience = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM target_audiences WHERE id = ?', [id]);
    return res.json({ message: 'Target audiens berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteTargetAudience error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- Design Styles ---

export const getDesignStyles = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, description, prompt, imageUrl FROM design_styles ORDER BY name ASC');
    return res.json(result.rows);
  } catch (error: any) {
    console.error('getDesignStyles error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createDesignStyle = async (req: Request, res: Response) => {
  const { name, description, prompt, imageUrl } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const existing = await query('SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
    }

    const id = uuidv4();
    await query('INSERT INTO design_styles (id, name, description, prompt, imageUrl) VALUES (?, ?, ?, ?, ?)', [id, name.trim(), description || null, prompt || null, imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), description, prompt, imageUrl });
  } catch (error: any) {
    console.error('createDesignStyle error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateDesignStyle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, prompt, imageUrl } = req.body;
  if (!name) return res.status(400).json({ message: 'Name is required.' });

  try {
    const existing = await query('SELECT id FROM design_styles WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Gaya Desain "${name}" sudah ada.` });
    }

    const oldResult = await query('SELECT imageUrl FROM design_styles WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('UPDATE design_styles SET name = ?, description = ?, prompt = ?, imageUrl = ? WHERE id = ?', [name.trim(), description || null, prompt || null, imageUrl || null, id]);

    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up design style image:', err));
    }

    return res.json({ id, name: name.trim(), description, prompt, imageUrl });
  } catch (error: any) {
    console.error('updateDesignStyle error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteDesignStyle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const oldResult = await query('SELECT imageUrl FROM design_styles WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('DELETE FROM design_styles WHERE id = ?', [id]);

    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up design style image:', err));
    }

    return res.json({ message: 'Gaya desain berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteDesignStyle error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- Groq API Keys ---

export const getGroqApiKeys = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, api_key, is_active, error_count FROM groq_api_keys ORDER BY error_count ASC');
    const mapped = result.rows.map((row) => ({
      id: row.id,
      api_key: row.api_key,
      is_active: row.is_active === 1 || row.is_active === true || row.is_active === 'true',
      error_count: parseInt(row.error_count, 10) || 0,
    }));
    return res.json(mapped);
  } catch (error: any) {
    console.error('getGroqApiKeys error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createGroqApiKey = async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (!apiKey) return res.status(400).json({ message: 'API Key is required.' });

  try {
    const existing = await query('SELECT id FROM groq_api_keys WHERE api_key = ?', [apiKey.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'API Key tersebut sudah ditambahkan sebelumnya.' });
    }

    const id = uuidv4();
    await query(
      'INSERT INTO groq_api_keys (id, api_key, is_active, error_count) VALUES (?, ?, ?, ?)',
      [id, apiKey.trim(), true, 0]
    );
    return res.status(201).json({ id, api_key: apiKey.trim(), is_active: true, error_count: 0 });
  } catch (error: any) {
    console.error('createGroqApiKey error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteGroqApiKey = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM groq_api_keys WHERE id = ?', [id]);
    return res.json({ message: 'API Key berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteGroqApiKey error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const resetGroqApiKeyErrors = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('UPDATE groq_api_keys SET error_count = 0 WHERE id = ?', [id]);
    return res.json({ message: 'Error count berhasil direset.' });
  } catch (error: any) {
    console.error('resetGroqApiKeyErrors error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- Themes ---

export const getThemes = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT id, name, category, description, prompt, imageUrl FROM themes';
    const params: any[] = [];
    if (category) {
      sql += ' WHERE LOWER(category) = LOWER(?)';
      params.push((category as string).trim());
    }
    sql += ' ORDER BY name ASC';
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (error: any) {
    console.error('getThemes error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createTheme = async (req: Request, res: Response) => {
  const { name, category, description, prompt, imageUrl } = req.body;
  if (!name || !category) return res.status(400).json({ message: 'Name and Category are required.' });

  try {
    const existing = await query('SELECT id FROM themes WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Tema "${name}" sudah ada.` });
    }

    const id = uuidv4();
    await query('INSERT INTO themes (id, name, category, description, prompt, imageUrl) VALUES (?, ?, ?, ?, ?, ?)', [id, name.trim(), category.trim().toUpperCase(), description || null, prompt || null, imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), category: category.trim().toUpperCase(), description, prompt, imageUrl });
  } catch (error: any) {
    console.error('createTheme error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateTheme = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, description, prompt, imageUrl } = req.body;
  if (!name || !category) return res.status(400).json({ message: 'Name and Category are required.' });

  try {
    const existing = await query('SELECT id FROM themes WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Tema "${name}" sudah ada.` });
    }

    const oldResult = await query('SELECT imageUrl FROM themes WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('UPDATE themes SET name = ?, category = ?, description = ?, prompt = ?, imageUrl = ? WHERE id = ?', [name.trim(), category.trim().toUpperCase(), description || null, prompt || null, imageUrl || null, id]);

    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up theme image:', err));
    }

    return res.json({ id, name: name.trim(), category: category.trim().toUpperCase(), description, prompt, imageUrl });
  } catch (error: any) {
    console.error('updateTheme error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteTheme = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const oldResult = await query('SELECT imageUrl FROM themes WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('DELETE FROM themes WHERE id = ?', [id]);

    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up theme image:', err));
    }

    return res.json({ message: 'Tema berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteTheme error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- Characters ---

const normalizeLocalAssetUrl = (imageUrl: unknown): string | null => {
  if (typeof imageUrl !== 'string') return null;

  const trimmed = imageUrl.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const normalized = trimmed.replace(/\\/g, '/').replace(/^\/+/, '');
  const relativePath = normalized.startsWith('assets/')
    ? normalized.substring('assets/'.length)
    : normalized;
  const fullPath = path.join(getAssetsPath(), relativePath);

  return fs.existsSync(fullPath) ? normalized : null;
};

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name, prompt, imageUrl, createdAt, updatedAt FROM characters ORDER BY name ASC');
    const rows = result.rows.map((row: any) => ({
      ...row,
      imageUrl: normalizeLocalAssetUrl(row.imageUrl),
    }));
    return res.json(rows);
  } catch (error: any) {
    console.error('getCharacters error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const createCharacter = async (req: Request, res: Response) => {
  const { name, prompt, imageUrl } = req.body;
  if (!name || !prompt) return res.status(400).json({ message: 'Name and Prompt are required.' });

  try {
    const existing = await query('SELECT id FROM characters WHERE LOWER(name) = LOWER(?)', [name.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Karakter "${name}" sudah ada.` });
    }

    const id = uuidv4();
    await query('INSERT INTO characters (id, name, prompt, imageUrl) VALUES (?, ?, ?, ?)', [id, name.trim(), prompt.trim(), imageUrl || null]);
    return res.status(201).json({ id, name: name.trim(), prompt: prompt.trim(), imageUrl });
  } catch (error: any) {
    console.error('createCharacter error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateCharacter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, prompt, imageUrl } = req.body;
  if (!name || !prompt) return res.status(400).json({ message: 'Name and Prompt are required.' });

  try {
    const existing = await query('SELECT id FROM characters WHERE LOWER(name) = LOWER(?) AND id != ?', [name.trim(), id]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: `Karakter "${name}" sudah ada.` });
    }

    const oldResult = await query('SELECT imageUrl FROM characters WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('UPDATE characters SET name = ?, prompt = ?, imageUrl = ?, updatedAt = NOW() WHERE id = ?', [name.trim(), prompt.trim(), imageUrl || null, id]);

    if (oldImageUrl && oldImageUrl !== imageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up character image:', err));
    }

    return res.json({ id, name: name.trim(), prompt: prompt.trim(), imageUrl });
  } catch (error: any) {
    console.error('updateCharacter error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const deleteCharacter = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const oldResult = await query('SELECT imageUrl FROM characters WHERE id = ?', [id]);
    const oldImageUrl = oldResult.rows[0]?.imageUrl;

    await query('DELETE FROM characters WHERE id = ?', [id]);

    if (oldImageUrl) {
      cleanUnusedAsset(oldImageUrl).catch(err => console.error('Error cleaning up character image:', err));
    }

    return res.json({ message: 'Karakter berhasil dihapus.' });
  } catch (error: any) {
    console.error('deleteCharacter error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- Digital Product Types ---

export const getDigitalProductTypes = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT id, name FROM digital_product_types ORDER BY name ASC');
    return res.json(result.rows);
  } catch (error: any) {
    console.error('getDigitalProductTypes error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

