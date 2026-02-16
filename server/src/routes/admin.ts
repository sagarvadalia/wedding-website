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
import { validate } from '../middleware/validate.js';
import {
  mongoIdParamsSchema,
  addGuestSchema,
  updateGuestSchema,
  createGroupSchema,
  updateGroupSchema,
} from '../schemas/admin.js';

const router = Router();

router.use(authMiddleware);

// Guests
router.get('/guests', getAllGuests);
router.post('/guests', validate({ body: addGuestSchema }), addGuest);
router.put('/guests/:id', validate({ params: mongoIdParamsSchema, body: updateGuestSchema }), updateGuest);
router.delete('/guests/:id', validate({ params: mongoIdParamsSchema }), deleteGuest);

// Groups
router.get('/groups', getAllGroups);
router.get('/groups/:id', validate({ params: mongoIdParamsSchema }), getGroup);
router.post('/groups', validate({ body: createGroupSchema }), createGroup);
router.put('/groups/:id', validate({ params: mongoIdParamsSchema, body: updateGroupSchema }), updateGroup);
router.delete('/groups/:id', validate({ params: mongoIdParamsSchema }), deleteGroup);

// Stats
router.get('/stats', getStats);

export default router;
