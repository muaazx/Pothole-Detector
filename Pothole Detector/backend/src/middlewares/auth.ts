import { Request, Response, NextFunction } from 'express';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
    role?: string;
  };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For local dev without auth, bypass or mock
    if (process.env.NODE_ENV !== 'production') {
      req.user = { uid: 'mock-user-123', role: 'citizen' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      role: decodedToken.role || 'citizen'
    };
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    // Fallback for dev mode if token fails
    if (process.env.NODE_ENV !== 'production') {
      req.user = { uid: 'mock-user-123', role: 'citizen' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export default authMiddleware;
