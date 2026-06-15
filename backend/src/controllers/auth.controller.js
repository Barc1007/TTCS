import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { sendOtpEmail } from '../utils/mailer.js';

// Lưu OTP tạm trong bộ nhớ: key = email, value = { otp, expiresAt }
const otpStore = new Map();


function sanitizeUser(user) {
  return {
    id:                 user._id,
    name:               user.name,
    username:           user.username,
    email:              user.email,
    role:               user.role,
    residentId:         user.residentId,
    mustChangePassword: user.mustChangePassword,
    createdAt:          user.createdAt,
    updatedAt:          user.updatedAt,
  };
}

export async function register(req, res) {
  const { name, username, email, password, role } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
  }

  // Chỉ cho phép tạo tài khoản staff hoặc resident
  // Admin không thể tạo thêm admin qua API này
  const ALLOWED_ROLES = ['staff', 'resident'];
  const assignedRole = ALLOWED_ROLES.includes(role) ? role : 'staff';

  const existing = await User.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    return res.status(409).json({ message: 'Tên đăng nhập hoặc email đã tồn tại' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name, username, email, passwordHash,
    role: assignedRole,
    // Cư dân bắt buộc đổi mật khẩu lần đầu đăng nhập
    mustChangePassword: assignedRole === 'resident',
  });
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

// POST /auth/change-password
// Dành cho cư dân đổi mật khẩu mặc định (lần đăng nhập đầu tiên)
export async function changePassword(req, res) {
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng' });
  }

  user.passwordHash       = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  await user.save();

  return res.json({ message: 'Đổi mật khẩu thành công' });
}

// POST /auth/update-password
// Dành cho user đang đăng nhập muốn đổi mật khẩu (yêu cầu mật khẩu cũ)
export async function updatePassword(req, res) {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ mật khẩu cũ và mới' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });

  const valid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Mật khẩu cũ không chính xác' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.json({ message: 'Đổi mật khẩu thành công' });
}


// POST /auth/forgot-password
// Bước 1: Nhận email → tạo OTP → gửi email
export async function forgotPassword(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này' });

  // Sinh OTP 6 số ngẫu nhiên
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 phút
  otpStore.set(email.toLowerCase(), { otp, expiresAt });

  try {
    await sendOtpEmail(email, otp);
    return res.json({ message: 'Mã OTP đã được gửi đến email của bạn' });
  } catch (err) {
    console.error('Lỗi gửi email:', err.message);
    return res.status(500).json({ message: 'Không thể gửi email. Kiểm tra cấu hình GMAIL_USER và GMAIL_APP_PASS.' });
  }
}

// POST /auth/reset-password
// Bước 2: Xác minh OTP + đặt mật khẩu mới
export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: 'Thiếu thông tin: email, otp, newPassword' });

  if (newPassword.length < 8)
    return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' });

  const record = otpStore.get(email.toLowerCase());
  if (!record) return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ message: 'OTP đã hết hạn (10 phút). Vui lòng yêu cầu lại.' });
  }
  if (record.otp !== otp) return res.status(400).json({ message: 'OTP không chính xác' });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.mustChangePassword = false;
  await user.save();
  otpStore.delete(email.toLowerCase()); // Xóa OTP sau khi dùng

  return res.json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.' });
}

