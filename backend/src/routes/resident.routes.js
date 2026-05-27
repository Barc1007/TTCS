import { Router } from 'express';
import {
  createResident,
  deleteResident,
  getResidentById,
  getResidentStats,
  listResidents,
  registerTamTru,
  registerTamVang,
  updateResident,
} from '../controllers/resident.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', listResidents);
router.get('/stats', getResidentStats);
router.get('/:id', getResidentById);
router.post('/', requireRole('admin', 'staff'), createResident);
router.put('/:id', requireRole('admin', 'staff'), updateResident);
router.delete('/:id', requireRole('admin'), deleteResident);
router.post('/:id/tam-tru', requireRole('admin', 'staff'), registerTamTru);
router.post('/:id/tam-vang', requireRole('admin', 'staff'), registerTamVang);

export default router;
