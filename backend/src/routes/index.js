import { Router } from 'express';
import authRoutes from './auth.routes.js';
import residentRoutes from './resident.routes.js';
import householdRoutes from './household.routes.js';
import activityLogRoutes from './activityLog.routes.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'ResidentIQ API v1' });
});

router.use('/auth', authRoutes);
router.use('/residents', residentRoutes);
router.use('/households', householdRoutes);
router.use('/activity-logs', activityLogRoutes);

export default router;
