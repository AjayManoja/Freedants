import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Malformed ObjectId in a URL parameter
  if (err?.name === 'CastError') {
    return res.status(400).json({ error: 'INVALID_ID' });
  }
  if (err instanceof MulterError) {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: err.code });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Validation Error', details: err.errors });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
};
