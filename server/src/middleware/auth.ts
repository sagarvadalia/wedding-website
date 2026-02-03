import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthRequest, 
  res: Response, 
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  if (!token) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }
  
  try {
    const secret = process.env.JWT_SECRET ?? 'wedding-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // Validate the decoded payload has required fields
    if (
      typeof decoded === 'object' && 
      decoded !== null && 
      'id' in decoded && 
      'email' in decoded && 
      'role' in decoded
    ) {
      req.user = decoded as JwtPayload;
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
