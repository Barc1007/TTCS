import { Router } from 'express';
import { login, me, register, changePassword } from '../controllers/auth.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Chỉ admin mới được tạo tài khoản mới cho hệ thống
router.post('/register', requireAuth, requireRole('admin'), register);
router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/change-password', requireAuth, changePassword);

export default router;
