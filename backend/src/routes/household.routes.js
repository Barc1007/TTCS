import { Router } from 'express';
import { createHousehold, listHouseholds, migrateHouseholdsFromResidents } from '../controllers/household.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', listHouseholds);
router.post('/migrate-from-residents', requireRole('admin'), migrateHouseholdsFromResidents);
router.post('/', requireRole('admin', 'staff'), createHousehold);

export default router;
