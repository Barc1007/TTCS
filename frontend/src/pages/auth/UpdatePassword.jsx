import { useState } from 'react';
import { api } from '../../utils/api';
import { useResidents } from '../../context/ResidentContext';
import { IcLock, IcEye, IcEyeOff, IcCheck } from '../../components/ui/Icons';

export default function UpdatePassword() {
  const { showToast } = useResidents();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vui lòng điền đầy đủ các trường.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/update-password', {
        oldPassword,
        newPassword
      });
      showToast(res.message || 'Đổi mật khẩu thành công!', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IcLock size={22} />
            Đổi Mật Khẩu
          </h1>
          <p className="page-subtitle">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
        </div>
      </div>

      <div style={{ maxWidth: 500 }}>
        <div style={{
          background: '#fff', borderRadius: 16, border: '1px solid #e8eaf2',
          padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Mật khẩu cũ <span className="required">*</span></label>
              <div className="input-pwd-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showOld ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu hiện tại"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  {showOld ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Mật khẩu mới <span className="required">*</span></label>
              <div className="input-pwd-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  {showNew ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label>Xác nhận mật khẩu mới <span className="required">*</span></label>
              <div className="input-pwd-wrap" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 40px 10px 12px', borderRadius: 8, border: '1px solid #d1d5db' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{ position: 'absolute', right: 10, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  {showConfirm ? <IcEyeOff size={16} /> : <IcEye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert-error" style={{ marginBottom: 20, fontSize: 13, padding: '10px 14px' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              {loading ? 'Đang cập nhật...' : <><IcCheck size={16} /> Lưu Thay Đổi</>}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
