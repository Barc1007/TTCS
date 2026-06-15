import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IcBuilding, IcEye, IcEyeOff, IcLock, IcKey } from '../../components/ui/Icons';

export default function ChangePassword() {
  const { user, changePassword } = useAuth();
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setLoading(true);
    try {
      await changePassword(newPassword);
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại, vui lòng thử lại!');
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
          <p className="auth-brand-sub">Hệ Thống Quản Lý Dân Cư Thông Minh</p>

          <div className="auth-features">
            <div className="auth-feature-item">
              <span className="auth-feature-dot" style={{ background: '#34d399' }} />
              Tài khoản cư dân được bảo mật
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot" style={{ background: '#60a5fa' }} />
              Xem thông tin cư trú cá nhân
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-dot" style={{ background: '#f472b6' }} />
              Theo dõi trạng thái tạm trú / tạm vắng
            </div>
          </div>

          <div className="auth-brand-badge">
            <span className="brand-badge-dot" />
            Hệ thống đang hoạt động ổn định
          </div>
        </div>

        <div className="auth-deco-circle auth-deco-1" />
        <div className="auth-deco-circle auth-deco-2" />
        <div className="auth-deco-circle auth-deco-3" />
      </div>

      {/* Panel phải – form đổi mật khẩu */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-header">
            {/* Cảnh báo lần đầu đăng nhập */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fffbeb', border: '1px solid #f5a623',
              borderRadius: 10, padding: '10px 14px', marginBottom: 16,
            }}>
              <IcKey size={18} style={{ color: '#f5a623', flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                Đây là lần đăng nhập đầu tiên của bạn.
                Vui lòng đặt mật khẩu mới để tiếp tục.
              </p>
            </div>

            <h2>Đặt Mật Khẩu Mới</h2>
            <p>Xin chào, <strong>{user?.name}</strong>! Hãy tạo mật khẩu riêng của bạn.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Mật khẩu mới */}
            <div className="auth-field">
              <label>Mật khẩu mới</label>
              <div className="auth-input-wrap">
                <IcLock size={16} className="auth-input-icon" />
                <input
                  type={showNew ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Tối thiểu 8 ký tự"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowNew(v => !v)}>
                  {showNew ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="auth-field">
              <label>Xác nhận mật khẩu</label>
              <div className="auth-input-wrap">
                <IcLock size={16} className="auth-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-eye-btn" onClick={() => setShowConfirm(v => !v)}>
                  {showConfirm ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            {/* Gợi ý mật khẩu */}
            <div style={{
              fontSize: 12, color: '#8b92a9',
              background: '#f8f9fc', borderRadius: 8,
              padding: '8px 12px', lineHeight: 1.7,
            }}>
              Mật khẩu nên có: tối thiểu 8 ký tự, bao gồm chữ hoa và số.
            </div>

            {/* Thông báo lỗi */}
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
                  Đang lưu...
                </>
              ) : 'Xác Nhận Đổi Mật Khẩu'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
