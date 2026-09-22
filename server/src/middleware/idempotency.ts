import { Request, Response, NextFunction } from 'express';

export const idempotency = (req: Request, res: Response, next: NextFunction) => {
  const idempotencyKey = req.headers['idempotency-key'];
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header is required' });
  }
  (req as any).idempotencyKey = idempotencyKey;
  next();
};
