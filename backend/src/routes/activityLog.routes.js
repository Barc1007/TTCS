import { Router } from 'express';
import { listActivityLogs } from '../controllers/activityLog.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireRole('admin', 'staff'), listActivityLogs);

export default router;
