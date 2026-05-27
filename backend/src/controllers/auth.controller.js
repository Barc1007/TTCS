import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(req, res) {
  const { name, username, email, password, role = 'viewer' } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return res.status(409).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, username, email, passwordHash, role });
  const token = signToken({ id: user._id, role: user.role, username: user.username });

  return res.status(201).json({
    message: 'Đăng ký thành công',
    token,
    user: sanitizeUser(user),
  });
}

export async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });

  if (!user) {
    return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Thông tin đăng nhập không chính xác' });
  }

  const token = signToken({ id: user._id, role: user.role, username: user.username });

  return res.json({
    message: 'Đăng nhập thành công',
    token,
    user: sanitizeUser(user),
  });
}

export async function me(req, res) {
  return res.json({ user: req.user });
}
