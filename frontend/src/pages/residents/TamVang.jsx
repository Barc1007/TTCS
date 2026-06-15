import { IcCheck } from '../../components/ui/Icons';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResidents } from '../../context/ResidentContext';

const TODAY = new Date().toISOString().split('T')[0];

export default function TamVang() {
  const { residents, registerTamVang } = useResidents();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    resident: '', start: TODAY, end: '', dest: '', reason: '', phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    setError('');
    if (!form.resident || !form.start || !form.end || !form.dest || !form.reason || !form.phone) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (form.end < form.start) {
      setError('Ngày kết thúc không được nhỏ hơn ngày bắt đầu.');
      return;
    }
    registerTamVang(form.resident, {
      start: form.start,
      end: form.end,
      destination: form.dest,
      reason: form.reason,
      phone: form.phone,
    }).then(() => {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setTimeout(() => navigate('/residents'), 800);
    }).catch((err) => setError(err.message || 'Không thể đăng ký tạm vắng'));
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div className="back-row">
          <button type="button" className="btn-back" onClick={() => navigate('/residents')}>← Quay lại</button>
          <div>
            <h2>Đăng Ký Tạm Vắng</h2>
            <p className="subtitle">Đăng ký tạm vắng cho cư dân</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 680 }}>
        <div className="form-body">
          <div className="form-group">
            <label>Cư dân <span className="required">*</span></label>
            <select value={form.resident} onChange={set('resident')}>
              <option value="">-- Chọn cư dân --</option>
              {residents.map(r => (
                <option key={r._id} value={r._id}>{r.name} – Phòng {r.room}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày đi <span className="required">*</span></label>
              <input type="date" value={form.start} onChange={set('start')} />
            </div>
            <div className="form-group">
              <label>Ngày dự kiến về <span className="required">*</span></label>
              <input type="date" value={form.end} onChange={set('end')} />
            </div>
          </div>
          <div className="form-group">
            <label>Nơi đến <span className="required">*</span></label>
            <input type="text" placeholder="Hà Nội" value={form.dest} onChange={set('dest')} />
          </div>
          <div className="form-group">
            <label>Lý do tạm vắng <span className="required">*</span></label>
            <textarea rows={3} placeholder="Công tác, học tập..."
              value={form.reason} onChange={set('reason')} />
          </div>
          <div className="form-group">
            <label>Số điện thoại liên hệ <span className="required">*</span></label>
            <input type="tel" placeholder="0901234567"
              value={form.phone} onChange={set('phone')} />
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">✅ Đăng ký tạm vắng thành công!</div>}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/residents')}>Hủy</button>
          <button type="button" className="btn-primary" onClick={handleSave}><IcCheck size={14}/> Xác Nhận Đăng Ký</button>
        </div>
      </div>
    </main>
  );
}
