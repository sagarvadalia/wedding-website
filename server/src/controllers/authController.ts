import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/errors.js';

const JWT_EXPIRY = '24h';

/**
 * POST /api/admin/login
 * Body: { password }. Returns { token } (JWT) on success.
 * Requires ADMIN_PASSWORD and JWT_SECRET in env.
 */
export async function login(req: Request, res: Response): Promise<void> {
  const password = (req.body as { password?: string }).password ?? '';
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminPassword) {
    throw new HttpError(503, 'Admin login is not configured (missing ADMIN_PASSWORD)');
  }

  if (password !== adminPassword) {
    throw new HttpError(401, 'Incorrect password');
  }

  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new HttpError(503, 'Admin login is not configured (missing JWT_SECRET)');
  }

  const token = jwt.sign(
    { id: 'admin', email: 'admin@localhost', role: 'admin' },
    secret,
    { expiresIn: JWT_EXPIRY }
  );

  res.json({ token });
}
