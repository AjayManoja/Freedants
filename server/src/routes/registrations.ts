import { Router, Request, Response, NextFunction } from 'express';
import { Registration } from '../models/Registration';
import { Competition } from '../models/Competition';
import { auth } from '../middleware/auth';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

// POST /api/registrations/:id/confirm-payment
router.post('/:id/confirm-payment', mutationLimiter, auth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { success, paymentId } = req.body;

    const reg = await Registration.findById(id);
    if (!reg) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    // Only the user who made the registration can confirm or cancel it
    if (String(reg.userId) !== String((req as any).userId)) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    if (reg.status !== 'pending_payment') {
      return res.status(400).json({ error: 'INVALID_STATE', message: 'Registration is not in pending_payment state' });
    }

    if (success) {
      // Confirm the payment
      reg.status = 'confirmed';
      reg.paymentId = paymentId || `mock_pay_${Date.now()}`;
      await reg.save();
    } else {
      // Payment failed — cancel registration and roll back the spot
      reg.status = 'cancelled';
      await reg.save();

      await Competition.findByIdAndUpdate(
        reg.competitionId,
        { $inc: { bookedCount: -1 } }
      );
    }

    res.json(reg);
  } catch (err) {
    next(err);
  }
});

export default router;
