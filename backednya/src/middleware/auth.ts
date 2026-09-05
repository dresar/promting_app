import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak disediakan.' });
  }

  const secret = process.env.JWT_SECRET || 'promptstudio_access_secret_key_change_this_in_production_2024';

  jwt.verify(token, secret, (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Sesi telah berakhir, silakan login kembali (Token expired).' });
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  });
};
