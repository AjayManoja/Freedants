import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { config } from '../config';

/**
 * Stub authentication: the caller identifies itself with an X-Demo-User-Id header.
 * Outside production, a missing header falls back to the seeded demo user.
 * Replace with real token verification (JWT / session) before going live.
 */
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers['x-demo-user-id'];
  const userId = (Array.isArray(header) ? header[0] : header) || (config.isProduction ? undefined : config.demoUserId);

  if (!userId) {
    return res.status(401).json({ error: 'UNAUTHORIZED' });
  }
  if (!Types.ObjectId.isValid(userId)) {
    return res.status(401).json({ error: 'INVALID_USER' });
  }
  (req as any).userId = userId;
  next();
};
