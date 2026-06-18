import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IcBuilding, IcEye, IcEyeOff } from '../../components/ui/Icons';

export default function Login({ onSwitch }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError('Vui lòng nhập đầy đủ thông tin!'); return; }
    setLoading(true);
    try {
      setError('');
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Sai tên đăng nhập hoặc mật khẩu!');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Panel trái – brand */}
      <div className="auth-brand">
        <div className="auth-brand-inner">
          <div className="auth-brand-logo">
            <IcBuilding size={32} />
          </div>
          <h1 className="auth-brand-title">ResidentIQ</h1>
          <p className="auth-brand-sub">Cổng thông tin dành cho cư dân và ban quản lý chung cư</p>


        </div>

        {/* Decorative circles */}
        <div className="auth-deco-circle auth-deco-1" />
        <div className="auth-deco-circle auth-deco-2" />
        <div className="auth-deco-circle auth-deco-3" />
      </div>

      {/* Panel phải – form */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <h2>Đăng nhập</h2>
            <p>Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Tên đăng nhập hoặc Email</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  className="auth-input"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="auth-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <IcEyeOff size={16}/> : <IcEye size={16}/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  Đang đăng nhập...
                </>
              ) : 'Đăng Nhập'}
            </button>
          </form>

          <div className="auth-form-footer">
            <a className="auth-link" onClick={() => onSwitch('forgot')}>Quên mật khẩu?</a>
          </div>


        </div>
      </div>
    </div>
  );
}
