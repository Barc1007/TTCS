import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IcBuilding, IcEye, IcEyeOff } from '../../components/ui/Icons';

export default function Register({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name:'', username:'', email:'', password:'', password2:'' });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    const { name, username, email, password, password2 } = form;
    if (!name || !username || !email || !password) { setError('Vui lòng điền đầy đủ thông tin!'); return; }
    if (password.length < 6)    { setError('Mật khẩu phải có ít nhất 6 ký tự!'); return; }
    if (password !== password2) { setError('Mật khẩu xác nhận không khớp!'); return; }
    setLoading(true);
    try {
      await register({ name, username, email, password });
      setSuccess('Tạo tài khoản thành công! Đang chuyển đến trang tổng quan...');
      setForm({ name:'', username:'', email:'', password:'', password2:'' });
      setTimeout(() => onSwitch('login'), 800);
    } catch (err) {
      setError(err.message || 'Không thể tạo tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card" style={{ maxWidth: 500 }}>
        <div className="login-logo">
          <div className="logo-icon"><IcBuilding size={28} /></div>
          <h1>Tạo Tài Khoản</h1>
          <p>Đăng ký để sử dụng hệ thống</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Họ và tên <span className="required">*</span></label>
              <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Tên đăng nhập <span className="required">*</span></label>
              <input type="text" placeholder="nguyenvana" value={form.username} onChange={set('username')} required />
            </div>
          </div>
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label>Mật khẩu <span className="required">*</span></label>
            <div className="input-pwd-wrap">
              <input type={showPwd ? 'text' : 'password'} placeholder="Tối thiểu 6 ký tự" value={form.password} onChange={set('password')} required />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu <span className="required">*</span></label>
            <div className="input-pwd-wrap">
              <input type={showPwd2 ? 'text' : 'password'} placeholder="Nhập lại mật khẩu" value={form.password2} onChange={set('password2')} required />
              <button type="button" className="pwd-toggle" onClick={() => setShowPwd2(v => !v)}>
                {showPwd2 ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
              </button>
            </div>
          </div>
          {error   && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">{success}</div>}
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}</button>
        </form>
        <div className="auth-links">
          <a onClick={() => onSwitch('login')}>← Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  );
}
