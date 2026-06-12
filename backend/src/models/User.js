import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    username:     { type: String, required: true, unique: true },
    email:        { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['admin', 'staff', 'resident'], default: 'staff' },
    // Liên kết tới hồ sơ cư dân (chỉ dùng cho role = 'resident')
    residentId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', default: null },
    // Bắt buộc đổi mật khẩu lần đầu đăng nhập (áp dụng cho cư dân mới)
    mustChangePassword: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

