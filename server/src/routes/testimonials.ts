import { Router, Request, Response, NextFunction } from 'express';
import { Testimonial } from '../models/Testimonial';
import { apiLimiter } from '../middleware/rateLimiter';
import { resolveLang, localizeTestimonial } from '../utils/localize';

const router = Router();

// GET /api/testimonials?limit=10&lang=hi — newest published testimonials
router.get('/', apiLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? '10'), 10) || 10, 1), 50);
    const items = await Testimonial.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name meta rating text createdAt translations')
      .lean();
    const lang = resolveLang(req);
    res.set('Cache-Control', 'public, max-age=300');
    res.set('Vary', 'Accept-Language');
    res.json({ lang, items: items.map((t) => localizeTestimonial(t, lang)) });
  } catch (err) {
    next(err);
  }
});

export default router;
