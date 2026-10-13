import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, UserDoc } from '../config/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'resume_builder_secret_jwt_key_2026';

export interface AuthRequest extends Request {
  user?: UserDoc;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = await db.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid session or user not found.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const optionalAuthToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = await db.findUserById(decoded.id);
    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore invalid token and continue as guest
  }
  next();
};
