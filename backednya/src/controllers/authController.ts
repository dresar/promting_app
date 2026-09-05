import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'promptstudio_access_secret_key_change_this_in_production_2024';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'promptstudio_refresh_secret_key_change_this_in_production_2024';

const signAccessToken = (userId: string, email: string, role: string) => {
  return jwt.sign(
    { userId, email, role, type: 'access' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const signRefreshToken = (userId: string, tokenId: string) => {
  return jwt.sign(
    { userId, tokenId, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const existing = await query('SELECT id FROM users WHERE email = ?', [email.trim()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await query(
      `INSERT INTO users (id, name, email, password, role, isDemo, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, 'USER', false, true, NOW(), NOW())`,
      [userId, name.trim(), email.trim(), hashedPassword]
    );

    await query(
      `INSERT INTO settings (id, userId, language, theme, notifications, createdAt, updatedAt)
       VALUES (?, ?, 'ID', 'SYSTEM', true, NOW(), NOW())
       ON DUPLICATE KEY UPDATE id=id`,
      [uuidv4(), userId]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())',
      [uuidv4(), userId, 'USER_REGISTERED']
    );

    const accessToken = signAccessToken(userId, email.trim(), 'USER');
    const refreshTokenId = uuidv4();
    const refreshToken = signRefreshToken(userId, refreshTokenId);

    await query(
      `INSERT INTO refresh_tokens (id, token, userId, expiresAt, isRevoked, createdAt)
       VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY, false, NOW())`,
      [refreshTokenId, refreshToken, userId]
    );

    return res.status(201).json({
      user: {
        id: userId,
        name,
        email: email.trim(),
        avatarUrl: null,
        role: 'USER',
        isDemo: false,
        createdAt: new Date().toISOString(),
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const result = await query(
      `SELECT id, name, email, password, avatarUrl, role, isDemo, isActive, createdAt
       FROM users WHERE email = ?`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const userRow = result.rows[0];
    const isActive = userRow.isActive === 1 || userRow.isActive === true || userRow.isActive === 'true';
    if (!isActive) {
      return res.status(401).json({ message: 'Akun tidak aktif.' });
    }

    const isMatch = await bcrypt.compare(password, userRow.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const userId = userRow.id;
    const role = userRow.role || 'USER';

    const accessToken = signAccessToken(userId, email.trim(), role);
    const refreshTokenId = uuidv4();
    const refreshToken = signRefreshToken(userId, refreshTokenId);

    await query(
      `INSERT INTO refresh_tokens (id, token, userId, expiresAt, isRevoked, createdAt)
       VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY, false, NOW())`,
      [refreshTokenId, refreshToken, userId]
    );

    await query(
      'INSERT INTO activity_logs (id, userId, action, createdAt) VALUES (?, ?, ?, NOW())',
      [uuidv4(), userId, 'USER_LOGGED_IN']
    );

    return res.json({
      user: {
        id: userId,
        name: userRow.name,
        email: userRow.email,
        avatarUrl: userRow.avatarUrl,
        role: role,
        isDemo: userRow.isDemo === 1 || userRow.isDemo === true,
        createdAt: userRow.createdAt,
      },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required.' });
  }

  try {
    let payload: any;
    try {
      payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (_) {
      return res.status(401).json({ message: 'Refresh token tidak valid atau sudah kadaluarsa.' });
    }

    const result = await query(
      `SELECT rt.id, rt.isRevoked, rt.expiresAt, u.id AS userId, u.email, u.role, u.isActive
       FROM refresh_tokens rt
       JOIN users u ON rt.userId = u.id
       WHERE rt.token = ?`,
      [refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Refresh token tidak ditemukan.' });
    }

    const row = result.rows[0];
    const isRevoked = row.isRevoked === 1 || row.isRevoked === true || row.isRevoked === 'true';
    const expiresAt = new Date(row.expiresAt);
    const isActive = row.isActive === 1 || row.isActive === true || row.isActive === 'true';

    if (isRevoked || expiresAt.getTime() < Date.now() || !isActive) {
      return res.status(401).json({ message: 'Refresh token tidak valid.' });
    }

    const userId = row.userId;
    if (payload.userId !== userId) {
      return res.status(401).json({ message: 'Token mismatch.' });
    }

    const newAccessToken = signAccessToken(userId, row.email, row.role || 'USER');

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ message: 'Server error: ' + (error.message || error.toString()) });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    try {
      await query(
        'UPDATE refresh_tokens SET isRevoked = true WHERE token = ?',
        [refreshToken]
      );
    } catch (_) {}
  }
  return res.json({ message: 'Logged out successfully.' });
};
