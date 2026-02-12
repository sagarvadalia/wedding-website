import { Router } from 'express';
import { lookupByName, getRsvpStatus, submitRsvp } from '../controllers/rsvpController.js';

const router = Router();

// Must be before any :param routes
router.get('/lookup', lookupByName);
router.get('/status', getRsvpStatus);

// Submit or update group RSVP (same endpoint for both)
router.post('/', submitRsvp);

export default router;
