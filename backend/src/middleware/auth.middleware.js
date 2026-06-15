import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Thiếu token xác thực' });
  }

  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Người dùng không tồn tại' });
    }
    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa xác thực' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Không đủ quyền truy cập' });
    }
    next();
  };
}
