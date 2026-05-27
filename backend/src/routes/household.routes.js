import { Router } from 'express';
import { createHousehold, listHouseholds } from '../controllers/household.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listHouseholds);
router.post('/', requireRole('admin', 'staff'), createHousehold);

export default router;
