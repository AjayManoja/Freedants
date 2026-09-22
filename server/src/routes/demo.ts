import { Router, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { seed } from '../seed';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

/** Delete every uploaded file so a demo run starts with an empty uploads folder. */
async function clearUploads() {
  const dir = path.resolve('uploads');
  const files = await fs.promises.readdir(dir).catch(() => [] as string[]);
  await Promise.all(
    files.filter((f) => f !== '.gitkeep').map((f) => fs.promises.unlink(path.join(dir, f)).catch(() => {}))
  );
}

/**
 * POST /api/demo/reset — restore the seeded state (registration open, no
 * registrations or submissions). Mounted only when DEMO_MODE is on, so the app
 * can start each demo session from a clean slate.
 */
router.post('/reset', mutationLimiter, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await seed();
    await clearUploads();
    res.json({ ok: true, ...result });
  } catch (err) {
    next(err);
  }
});

export default router;
