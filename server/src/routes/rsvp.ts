import { Router } from 'express';
import { lookupByName, getRsvpStatus, submitRsvp } from '../controllers/rsvpController.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { lookupQuerySchema, submitRsvpSchema } from '../schemas/rsvp.js';

const router = Router();

// Must be before any :param routes
router.get('/lookup', validate({ query: lookupQuerySchema }), asyncHandler(lookupByName));
router.get('/status', getRsvpStatus);

// Submit or update group RSVP (same endpoint for both)
router.post('/', validate({ body: submitRsvpSchema }), asyncHandler(submitRsvp));

export default router;
