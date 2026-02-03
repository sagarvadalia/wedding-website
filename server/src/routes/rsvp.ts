import { Router } from 'express';
import { 
  submitRsvp, 
  getRsvpByCode, 
  updateRsvp 
} from '../controllers/rsvpController.js';

const router = Router();

// Submit new RSVP
router.post('/', submitRsvp);

// Get RSVP by invite code
router.get('/:code', getRsvpByCode);

// Update existing RSVP
router.put('/:id', updateRsvp);

export default router;
