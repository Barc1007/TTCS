import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Tạo transporter gửi email qua Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.gmailUser,
    pass: env.gmailPass,   // App Password (16 ký tự), không phải mật khẩu Gmail thường
  },
});

/**
 * Gửi mã OTP đặt lại mật khẩu tới email người dùng
 * @param {string} toEmail  - Địa chỉ email nhận
 * @param {string} otp      - Mã OTP 6 số
 */
export async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"ResidentIQ System" <${env.gmailUser}>`,
    to: toEmail,
    subject: '[ResidentIQ] Mã xác nhận đặt lại mật khẩu',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">
        <div style="background:#1a3c5e;padding:20px;text-align:center">
          <h2 style="color:#fff;margin:0">ResidentIQ</h2>
          <p style="color:#a0c4e8;margin:4px 0 0">Hệ thống Quản lý Cư dân</p>
        </div>
        <div style="padding:32px">
          <p style="font-size:15px">Bạn vừa yêu cầu đặt lại mật khẩu. Sử dụng mã OTP dưới đây:</p>
          <div style="text-align:center;margin:24px 0">
            <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#1a3c5e;background:#f0f6ff;padding:12px 24px;border-radius:8px">${otp}</span>
          </div>
          <p style="color:#666;font-size:13px">⏰ Mã có hiệu lực trong <strong>10 phút</strong>.</p>
          <p style="color:#666;font-size:13px">Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>
        </div>
      </div>
    `,
  });
}
