import { Router, Request, Response, NextFunction } from 'express';
import { Competition } from '../models/Competition';
import { Registration } from '../models/Registration';
import { Submission } from '../models/Submission';
import { User } from '../models/User';
import { auth } from '../middleware/auth';
import { idempotency } from '../middleware/idempotency';
import { apiLimiter, mutationLimiter } from '../middleware/rateLimiter';
import mongoose from 'mongoose';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { config } from '../config';
import { resolveLang, localizeCompetition } from '../utils/localize';

const router = Router();
// Hard cap for any upload; each competition can set a lower limit in submissionRules
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith('video/') || /\.(mp4|mov)$/i.test(file.originalname)),
});

const removeUpload = (file?: Express.Multer.File) => {
  if (file) fs.promises.unlink(file.path).catch(() => {});
};

// GET /api/competitions/:slug?lang=hi
router.get('/:slug', apiLimiter, auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { slug } = req.params;

    const competition = await Competition.findOne({ slug });
    if (!competition) return res.status(404).json({ error: 'Competition not found' });

    const user = await User.findById(userId);

    const registration = await Registration.findOne({
      competitionId: competition._id,
      userId,
      status: { $ne: 'cancelled' },
    });

    const submission = await Submission.findOne({ competitionId: competition._id, userId });

    const now = new Date();
    const isClosed = now >= competition.dates.registrationClosesAt;
    const isFull = competition.bookedCount >= competition.capacity;

    let registrationStatus: string;
    if (submission) {
      registrationStatus = 'submitted';
    } else if (registration && registration.status === 'confirmed') {
      registrationStatus = 'registered';
    } else if (registration && registration.status === 'pending_payment') {
      registrationStatus = 'pending';
    } else if (isClosed) {
      registrationStatus = 'closed';
    } else if (isFull) {
      registrationStatus = 'full';
    } else {
      registrationStatus = 'open';
    }

    const me = {
      registrationStatus,
      submissionStatus: submission ? submission.status : null,
      referralUrl: user ? `${competition.referral.baseUrl}${user.referralCode}` : null,
      registrationId: registration ? registration._id : null,
      paymentId: registration?.paymentId || null,
      avatarUrl: user?.avatarUrl || null,
      name: user?.name || null,
    };

    const lang = resolveLang(req);
    res.json({
      lang,
      competition: localizeCompetition(competition.toObject(), lang),
      me,
      spotsLeft: Math.max(0, competition.capacity - competition.bookedCount),
      serverTime: now.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/competitions/:id/registrations — Atomic spot booking
router.post('/:id/registrations', mutationLimiter, auth, idempotency, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const idempotencyKey = (req as any).idempotencyKey;
    const { id } = req.params;

    // Idempotency: if same key was already used, return the existing registration
    const existing = await Registration.findOne({ idempotencyKey, userId });
    if (existing) {
      return res.status(201).json(existing);
    }

    // Check for existing active registration (different key = truly a second attempt)
    const anyReg = await Registration.findOne({
      competitionId: id,
      userId,
      status: { $ne: 'cancelled' },
    });
    if (anyReg) {
      return res.status(409).json({ error: 'ALREADY_REGISTERED' });
    }

    const now = new Date();

    // Atomic spot reservation using $expr to compare bookedCount < capacity
    const comp = await Competition.findOneAndUpdate(
      {
        _id: id,
        $expr: { $lt: ['$bookedCount', '$capacity'] },
        'dates.registrationClosesAt': { $gt: now },
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!comp) {
      // Determine why: not found, closed, or full
      const c = await Competition.findById(id);
      if (!c) return res.status(404).json({ error: 'Not found' });
      if (now >= c.dates.registrationClosesAt) return res.status(409).json({ error: 'CLOSED' });
      return res.status(409).json({ error: 'FULL' });
    }

    // Reuse a previously cancelled registration (failed payment) so the
    // unique (competitionId, userId) index doesn't block a retry.
    let reg;
    try {
      reg = await Registration.findOneAndUpdate(
        { competitionId: comp._id, userId, status: 'cancelled' },
        { status: 'pending_payment', idempotencyKey, paymentId: undefined, createdAt: new Date() },
        { new: true }
      );
      if (!reg) {
        reg = new Registration({
          competitionId: comp._id,
          userId,
          status: 'pending_payment',
          idempotencyKey,
        });
        await reg.save();
      }
    } catch (saveErr) {
      // Couldn't create the registration: release the reserved spot
      await Competition.findByIdAndUpdate(comp._id, { $inc: { bookedCount: -1 } });
      throw saveErr;
    }

    res.status(201).json(reg);
  } catch (err: any) {
    // If the registration save failed due to duplicate, roll back the spot
    if (err.code === 11000) {
      return res.status(409).json({ error: 'ALREADY_REGISTERED' });
    }
    next(err);
  }
});

// POST /api/competitions/:id/submissions — File upload
router.post('/:id/submissions', mutationLimiter, auth, upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'FILE_REQUIRED', message: 'Attach a video file (MP4 or MOV)' });
    }

    const comp = await Competition.findById(id);
    if (!comp) {
      removeUpload(req.file);
      return res.status(404).json({ error: 'Not found' });
    }

    const rules = comp.submissionRules || { maxSizeMb: 50, acceptedFormats: ['mp4', 'mov'] };
    const ext = path.extname(req.file.originalname).slice(1).toLowerCase();
    if (!rules.acceptedFormats.includes(ext)) {
      removeUpload(req.file);
      return res.status(415).json({ error: 'UNSUPPORTED_FORMAT', accepted: rules.acceptedFormats });
    }
    if (req.file.size > rules.maxSizeMb * 1024 * 1024) {
      removeUpload(req.file);
      return res.status(413).json({ error: 'FILE_TOO_LARGE', maxSizeMb: rules.maxSizeMb });
    }

    const now = new Date();
    if (now < comp.dates.submissionStartsAt || now > comp.dates.submissionEndsAt) {
      removeUpload(req.file);
      return res.status(409).json({ error: 'OUTSIDE_SUBMISSION_WINDOW' });
    }

    const reg = await Registration.findOne({ competitionId: id, userId, status: 'confirmed' });
    if (!reg) {
      removeUpload(req.file);
      return res.status(403).json({ error: 'NOT_REGISTERED' });
    }

    const submission = new Submission({
      competitionId: id,
      userId,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype.startsWith('video/') ? req.file.mimetype : (ext === 'mov' ? 'video/quicktime' : 'video/mp4'),
      status: 'submitted',
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (err: any) {
    removeUpload(req.file);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'ALREADY_SUBMITTED' });
    }
    next(err);
  }
});

// GET /api/competitions/:id/submissions/me
router.get('/:id/submissions/me', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const submission = await Submission.findOne({ competitionId: id, userId });
    if (!submission) return res.status(404).json({ error: 'Not found' });

    res.json({ ...submission.toObject(), playbackPath: `/competitions/${id}/submissions/me/file` });
  } catch (err) {
    next(err);
  }
});

// GET /api/competitions/:id/submissions/me/file — stream the caller's own video.
// Only the owner can fetch it; supports Range requests so players can seek.
router.get('/:id/submissions/me/file', auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const submission = await Submission.findOne({ competitionId: req.params.id, userId });
    if (!submission) return res.status(404).json({ error: 'Not found' });

    const filePath = path.resolve('uploads', path.basename(submission.fileUrl));
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'FILE_MISSING' });

    // Uploads are stored without an extension, so set the type explicitly
    res.type(submission.mimeType || 'video/mp4');
    res.set('Cache-Control', 'private, max-age=3600');
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

export default router;
