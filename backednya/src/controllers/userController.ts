import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';



export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive,
              u.createdAt, u.updatedAt,
              s.theme,
              COUNT(DISTINCT ph.id) AS prompt_count,
              COUNT(DISTINCT fp.id) AS favorite_count
       FROM users u
       LEFT JOIN settings s ON s.userId = u.id
       LEFT JOIN prompt_histories ph ON ph.userId = u.id
       LEFT JOIN favorite_prompts fp ON fp.userId = u.id
       WHERE u.id = ?
       GROUP BY u.id, u.name, u.email, u.avatarUrl, u.role, u.isDemo, u.isActive, u.createdAt, u.updatedAt, s.theme`,
      [userId]
    );

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
  } catch (error: any) {
    console.error('getProfile error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { name, avatarUrl } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await query(
      `UPDATE users SET name = ?, avatarUrl = COALESCE(?, avatarUrl), updatedAt = NOW()
       WHERE id = ?`,
      [name, avatarUrl || null, userId]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())',
      [uuidv4(), userId, 'PROFILE_UPDATED']
    );

    return getProfile(req, res);
  } catch (error: any) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required.' });
  }

  try {
    const result = await query('SELECT password FROM users WHERE id = ?', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan.' });
    }

    const storedHash = result.rows[0].password;
    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password saat ini tidak benar.' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE users SET password = ?, updatedAt = NOW() WHERE id = ?',
      [newHash, userId]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())',
      [uuidv4(), userId, 'PASSWORD_CHANGED']
    );

    return res.json({ message: 'Kata sandi berhasil diubah.' });
  } catch (error: any) {
    console.error('changePassword error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};
