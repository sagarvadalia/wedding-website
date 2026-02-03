import { Router } from 'express';
import { 
  getAllGuests, 
  addGuest, 
  deleteGuest, 
  getStats 
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// All admin routes are protected
router.use(authMiddleware);

// Get all guests
router.get('/guests', getAllGuests);

// Add new guest
router.post('/guests', addGuest);

// Delete guest
router.delete('/guests/:id', deleteGuest);

// Get RSVP statistics
router.get('/stats', getStats);

export default router;
