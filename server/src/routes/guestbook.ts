import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  listEntries,
  createEntry,
  deleteEntry,
  getPhoto,
  getAudio,
} from '../controllers/guestbookController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createGuestbookEntrySchema,
  listGuestbookQuerySchema,
} from '../schemas/guestbook.js';
import { mongoIdParamsSchema } from '../schemas/admin.js';

const router = Router();

const createEntryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many guestbook submissions. Please try again later.' },
});

router.get('/', validate({ query: listGuestbookQuerySchema }), listEntries);
router.get('/:id/photo', validate({ params: mongoIdParamsSchema }), getPhoto);
router.get('/:id/audio', validate({ params: mongoIdParamsSchema }), getAudio);
router.post('/', createEntryLimiter, validate({ body: createGuestbookEntrySchema }), createEntry);
router.delete('/:id', authMiddleware, validate({ params: mongoIdParamsSchema }), deleteEntry);

export default router;
