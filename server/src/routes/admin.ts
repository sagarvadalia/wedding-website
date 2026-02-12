import { Router } from 'express';
import {
  getAllGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  getAllGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
  getStats
} from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

// Guests
router.get('/guests', getAllGuests);
router.post('/guests', addGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

// Groups
router.get('/groups', getAllGroups);
router.get('/groups/:id', getGroup);
router.post('/groups', createGroup);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Stats
router.get('/stats', getStats);

export default router;
