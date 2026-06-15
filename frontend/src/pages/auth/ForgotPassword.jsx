import { useState } from 'react';
import { IcKey, IcEye, IcEyeOff } from '../../components/ui/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ForgotPassword({ onSwitch }) {
  const [step,     setStep]     = useState(1); // 1=nhập email, 2=nhập OTP, 3=mật khẩu mới, 4=thành công
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [showP,    setShowP]    = useState(false);
  const [showP2,   setShowP2]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  // Bước 1: Gửi email → backend tạo OTP và gửi qua Gmail
  const handleStep1 = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep(2);
    } catch {
      setError('Lỗi kết nối server.');
    } finally { setLoading(false); }
  };

  // Bước 2: Xác minh OTP + đặt mật khẩu mới (gọi 1 lần)
  const handleStep2 = (e) => { e.preventDefault(); setError(''); setStep(3); };

  const handleStep3 = async (e) => {
    e.preventDefault(); setError('');
    if (newPass.length < 8)    { setError('Mật khẩu phải có ít nhất 8 ký tự!'); return; }
    if (newPass !== newPass2)  { setError('Mật khẩu xác nhận không khớp!'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp, newPassword: newPass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setStep(4);
      setTimeout(() => onSwitch('login'), 2500);
    } catch {
      setError('Lỗi kết nối server.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon"><IcKey size={26} /></div>
          <h1>Quên Mật Khẩu?</h1>
          <p>Nhập email đã đăng ký để lấy lại mật khẩu</p>
        </div>

        {/* Thanh tiến trình */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {['Email','OTP','Mật khẩu mới'].map((label, i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{
                height:4, borderRadius:2, marginBottom:4,
                background: step > i+1 ? '#22c55e' : step === i+1 ? 'var(--primary)' : '#e5e7eb'
              }} />
              <span style={{ fontSize:11, color: step === i+1 ? 'var(--primary)' : '#9ca3af' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bước 1: Nhập email */}
        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div className="form-group">
              <label>Email đã đăng ký <span className="required">*</span></label>
              <input
                type="email"
                value={email} onChange={e => setEmail(e.target.value)} required
              />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Đang gửi...' : '📧 Gửi Mã OTP'}
            </button>
          </form>
        )}

        {/* Bước 2: Nhập OTP */}
        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div className="otp-hint">
              Mã OTP đã gửi đến <strong>{email}</strong><br />
              <em style={{ fontSize:12, opacity:.8 }}>Kiểm tra hộp thư (kể cả Spam). Hiệu lực 10 phút.</em>
            </div>
            <div className="form-group">
              <label>Mã OTP (6 chữ số)</label>
              <input
                type="text" maxLength={6}
                value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,''))}
                required style={{ letterSpacing:8, fontSize:22, textAlign:'center' }}
              />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full" disabled={!otp || otp.length < 6}>
              ✅ Xác Nhận OTP
            </button>
            <button type="button" className="btn-secondary btn-full" style={{marginTop:8}}
              onClick={handleStep1} disabled={loading}>
              {loading ? 'Đang gửi lại...' : '🔄 Gửi lại OTP'}
            </button>
          </form>
        )}

        {/* Bước 3: Nhập mật khẩu mới */}
        {step === 3 && (
          <form onSubmit={handleStep3}>
            <div className="form-group">
              <label>Mật khẩu mới <span className="required">*</span></label>
              <div className="input-pwd-wrap">
                <input
                  type={showP ? 'text' : 'password'}
                  value={newPass} onChange={e => setNewPass(e.target.value)} required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowP(v => !v)}>
                  {showP ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu <span className="required">*</span></label>
              <div className="input-pwd-wrap">
                <input
                  type={showP2 ? 'text' : 'password'}
                  value={newPass2} onChange={e => setNewPass2(e.target.value)} required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowP2(v => !v)}>
                  {showP2 ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
                </button>
              </div>
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full" disabled={loading}>
              {loading ? 'Đang đặt lại...' : '🔐 Đặt Lại Mật Khẩu'}
            </button>
          </form>
        )}

        {/* Bước 4: Thành công */}
        {step === 4 && (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:48 }}>✅</div>
            <h3 style={{ color:'#22c55e', margin:'12px 0 8px' }}>Thành công!</h3>
            <p style={{ color:'#666' }}>Mật khẩu đã được đặt lại.<br/>Đang chuyển về trang đăng nhập...</p>
          </div>
        )}

        <div className="auth-links">
          <a onClick={() => onSwitch('login')}>← Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
