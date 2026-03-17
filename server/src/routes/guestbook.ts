import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  listEntries,
  createEntry,
  deleteEntry,
} from '../controllers/guestbookController.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
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

router.get('/', validate({ query: listGuestbookQuerySchema }), asyncHandler(listEntries));
router.post('/', createEntryLimiter, validate({ body: createGuestbookEntrySchema }), asyncHandler(createEntry));
router.delete('/:id', authMiddleware, validate({ params: mongoIdParamsSchema }), asyncHandler(deleteEntry));

export default router;
