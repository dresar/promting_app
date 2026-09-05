import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

// --- App Config (Global) ---

export const getAppConfig = async (req: AuthRequest, res: Response) => {
  try {
    const result = await query('SELECT `key`, `value` FROM app_config');
    const config: Record<string, string> = {};
    result.rows.forEach((row) => {
      config[row.key] = row.value;
    });
    return res.json(config);
  } catch (error: any) {
    console.error('getAppConfig error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const setAppConfig = async (req: AuthRequest, res: Response) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ message: 'Key and value are required.' });
  }

  try {
    await query(
      `INSERT INTO app_config (\`key\`, \`value\`, updated_at) VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = NOW()`,
      [key, value]
    );
    return res.json({ key, value });
  } catch (error: any) {
    console.error('setAppConfig error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

// --- User Settings ---

export const getUserSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await query(
      `INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, 'SYSTEM', NOW(), NOW())
       ON DUPLICATE KEY UPDATE id=id`,
      [uuidv4(), userId]
    );

    const result = await query(
      'SELECT theme FROM settings WHERE userId = ?',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.json({ theme: 'SYSTEM' });
    }

    return res.json({ theme: result.rows[0].theme || 'SYSTEM' });
  } catch (error: any) {
    console.error('getUserSettings error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { theme } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!theme) return res.status(400).json({ message: 'Theme is required.' });

  try {
    await query(
      `INSERT INTO settings (id, userId, theme, createdAt, updatedAt)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE theme = VALUES(theme), updatedAt = NOW()`,
      [uuidv4(), userId, theme]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())',
      [uuidv4(), userId, 'SETTINGS_UPDATED']
    );

    return res.json({ theme });
  } catch (error: any) {
    console.error('updateUserSettings error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
