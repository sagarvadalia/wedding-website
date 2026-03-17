import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getAllGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  importGuests,
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getStats,
  sendRsvpReminderHandler,
  sendTravelReminderHandler,
} from '../controllers/adminController.js';
import { login } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import {
  mongoIdParamsSchema,
  addGuestSchema,
  updateGuestSchema,
  importGuestsSchema,
  createGroupSchema,
  updateGroupSchema,
  sendReminderSchema,
  loginSchema,
} from '../schemas/admin.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

router.post('/login', loginLimiter, validate({ body: loginSchema }), asyncHandler(login));

router.use(authMiddleware);

// Guests
router.get('/guests', asyncHandler(getAllGuests));
router.post('/guests', validate({ body: addGuestSchema }), asyncHandler(addGuest));
router.put('/guests/:id', validate({ params: mongoIdParamsSchema, body: updateGuestSchema }), asyncHandler(updateGuest));
router.delete('/guests/:id', validate({ params: mongoIdParamsSchema }), asyncHandler(deleteGuest));
router.post('/guests/import', validate({ body: importGuestsSchema }), asyncHandler(importGuests));

// Groups
router.get('/groups', asyncHandler(getAllGroups));
router.get('/groups/:id', validate({ params: mongoIdParamsSchema }), asyncHandler(getGroup));
router.post('/groups', validate({ body: createGroupSchema }), asyncHandler(createGroup));
router.put('/groups/:id', validate({ params: mongoIdParamsSchema, body: updateGroupSchema }), asyncHandler(updateGroup));
router.delete('/groups/:id', validate({ params: mongoIdParamsSchema }), asyncHandler(deleteGroup));

// Stats
router.get('/stats', asyncHandler(getStats));

// Reminders
router.post('/reminders/rsvp', validate({ body: sendReminderSchema }), asyncHandler(sendRsvpReminderHandler));
router.post('/reminders/travel', validate({ body: sendReminderSchema }), asyncHandler(sendTravelReminderHandler));

export default router;
