import { useState } from 'react';
import { DB } from '../../utils/db';
import { IcKey, IcEye, IcEyeOff } from '../../components/ui/Icons';

export default function ForgotPassword({ onSwitch }) {
  const [step,     setStep]     = useState(1);
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [newPass,  setNewPass]  = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [showP,    setShowP]    = useState(false);
  const [showP2,   setShowP2]   = useState(false);
  const [error,    setError]    = useState('');

  const handleStep1 = (e) => {
    e.preventDefault(); setError('');
    if (!DB.findUser(email.toLowerCase())) { setError('Không tìm thấy tài khoản với email này!'); return; }
    setStep(2);
  };
  const handleStep2 = (e) => {
    e.preventDefault(); setError('');
    if (otp !== '123456') { setError('Mã xác nhận không đúng! (Demo: 123456)'); return; }
    setStep(3);
  };
  const handleStep3 = (e) => {
    e.preventDefault(); setError('');
    if (newPass.length < 6)   { setError('Mật khẩu phải có ít nhất 6 ký tự!'); return; }
    if (newPass !== newPass2) { setError('Mật khẩu xác nhận không khớp!'); return; }
    DB.updatePassword(email.toLowerCase(), newPass);
    setTimeout(() => onSwitch('login'), 1500);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon"><IcKey size={26} /></div>
          <h1>Quên Mật Khẩu?</h1>
          <p>Nhập email để lấy lại mật khẩu</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStep1}>
            <div className="form-group">
              <label>Email đã đăng ký <span className="required">*</span></label>
              <input type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full">Gửi Mã Xác Nhận</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2}>
            <div className="otp-hint">
              Mã xác nhận đã gửi đến <strong>{email}</strong><br />
              <em style={{ fontSize: 12, opacity: .8 }}>(Demo: mã là <strong>123456</strong>)</em>
            </div>
            <div className="form-group">
              <label>Mã xác nhận (OTP)</label>
              <input type="text" placeholder="123456" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} required />
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full">Xác Nhận</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3}>
            <div className="form-group">
              <label>Mật khẩu mới <span className="required">*</span></label>
              <div className="input-pwd-wrap">
                <input type={showP ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={newPass} onChange={e => setNewPass(e.target.value)} required />
                <button type="button" className="pwd-toggle" onClick={() => setShowP(v => !v)}>
                  {showP ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu mới <span className="required">*</span></label>
              <div className="input-pwd-wrap">
                <input type={showP2 ? 'text' : 'password'} placeholder="Nhập lại" value={newPass2} onChange={e => setNewPass2(e.target.value)} required />
                <button type="button" className="pwd-toggle" onClick={() => setShowP2(v => !v)}>
                  {showP2 ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
                </button>
              </div>
            </div>
            {error && <div className="alert-error">{error}</div>}
            <button type="submit" className="btn-primary btn-full">Đổi Mật Khẩu</button>
          </form>
        )}

        <div className="auth-links">
          <a onClick={() => onSwitch('login')}>← Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
