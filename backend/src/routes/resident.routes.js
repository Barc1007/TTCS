import { Router } from 'express';
import {
  createResident,
  deleteResident,
  getMyResidentInfo,
  getResidentById,
  getResidentStats,
  listResidents,
  registerTamTru,
  registerTamVang,
  updateResident,
  exportResidentsPDF,
} from '../controllers/resident.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

// Route /me phải đặt TRƯỚC /:id để không bị nhầm thành ID
router.get('/me',    requireRole('resident'), getMyResidentInfo);
router.get('/',      listResidents);
router.get('/stats', getResidentStats);
router.get('/export/pdf', exportResidentsPDF);
router.get('/:id',   getResidentById);
router.post('/', requireRole('admin', 'staff'), createResident);
router.put('/:id', requireRole('admin', 'staff'), updateResident);
router.delete('/:id', requireRole('admin'), deleteResident);
router.post('/:id/tam-tru', requireRole('admin', 'staff'), registerTamTru);
router.post('/:id/tam-vang', requireRole('admin', 'staff'), registerTamVang);

export default router;
