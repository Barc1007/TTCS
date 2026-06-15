import { IcArrowLeft, IcSave } from '../../components/ui/Icons';
// Residents page: Form thêm cư dân mới
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResidents } from '../../context/ResidentContext';

const TODAY = new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  name: '', cccd: '', dob: '', gender: '', room: '', status: '',
  address: '', ethnic: 'Kinh', religion: 'Không', job: '',
  relation: 'Chủ hộ', regdate: TODAY,
};

export default function ResidentAdd() {
  const { addResident, residents } = useResidents();
  const navigate = useNavigate();
  const [form,  setForm]  = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.cccd || !form.dob || !form.gender || !form.room || !form.status) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!/^\d{12}$/.test(form.cccd)) {
      setError('Số CCCD phải đúng 12 chữ số!');
      return;
    }
    if (residents.some((r) => r.cccd === form.cccd)) {
      setError('CCCD đã tồn tại trong hệ thống!');
      return;
    }
    if (form.regdate > TODAY) {
      setError('Ngày đăng ký không được lớn hơn ngày hiện tại!');
      return;
    }
    if (form.relation === 'Chủ hộ' && residents.some((r) => r.room === form.room && r.relation === 'Chủ hộ')) {
      setError(`Phòng ${form.room} đã có Chủ hộ! Mỗi phòng chỉ được có 1 Chủ hộ.`);
      return;
    }
    addResident(form);
    navigate('/residents');
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div className="back-row">
          <button className="btn-back" onClick={() => navigate('/residents')}>← Quay lại</button>
          <div>
            <h2>Thêm Cư Dân Mới</h2>
            <p className="subtitle">Nhập đầy đủ thông tin cư dân</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid-2">
          {/* Thông tin cá nhân */}
          <div className="card">
            <div className="card-header"><h3>Thông Tin Cá Nhân</h3></div>
            <div className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên <span className="required">*</span></label>
                  <input type="text" placeholder="Nguyễn Văn A" value={form.name} onChange={set('name')} />
                </div>
                <div className="form-group">
                  <label>CCCD / CMT <span className="required">*</span></label>
                  <input type="text" placeholder="001234567890" value={form.cccd} onChange={set('cccd')} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ngày sinh <span className="required">*</span></label>
                  <input type="date" value={form.dob} onChange={set('dob')} />
                </div>
                <div className="form-group">
                  <label>Giới tính <span className="required">*</span></label>
                  <select value={form.gender} onChange={set('gender')}>
                    <option value="">-- Chọn --</option>
                    <option>Nam</option><option>Nữ</option><option>Khác</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Dân tộc</label>
                  <input type="text" placeholder="Kinh" value={form.ethnic} onChange={set('ethnic')} />
                </div>
                <div className="form-group">
                  <label>Tôn giáo</label>
                  <input type="text" placeholder="Không" value={form.religion} onChange={set('religion')} />
                </div>
              </div>
              <div className="form-group">
                <label>Nghề nghiệp</label>
                <input type="text" placeholder="Kỹ sư phần mềm" value={form.job} onChange={set('job')} />
              </div>
            </div>
          </div>

          {/* Thông tin cư trú */}
          <div className="card">
            <div className="card-header"><h3>Thông Tin Cư Trú</h3></div>
            <div className="form-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Số phòng <span className="required">*</span></label>
                  <input type="text" placeholder="101" value={form.room} onChange={set('room')} />
                </div>
                <div className="form-group">
                  <label>Trạng thái <span className="required">*</span></label>
                  <select value={form.status} onChange={set('status')}>
                    <option value="">-- Chọn --</option>
                    <option>Thường trú</option><option>Tạm trú</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Địa chỉ thường trú</label>
                <textarea placeholder="123 Đường ABC, Quận 1, TP.HCM" rows={3} value={form.address} onChange={set('address')} />
              </div>
              <div className="form-group">
                <label>Quan hệ với chủ hộ</label>
                <select value={form.relation} onChange={set('relation')}>
                  <option>Chủ hộ</option><option>Vợ/Chồng</option>
                  <option>Con</option><option>Cha/Mẹ</option><option>Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày đăng ký <span className="required">*</span></label>
                <input type="date" value={form.regdate} onChange={set('regdate')} />
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert-error" style={{ margin: '16px 0' }}>{error}</div>}

        <div className="form-actions" style={{ background: 'transparent', border: 'none', paddingLeft: 0, paddingRight: 0 }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/residents')}>Hủy</button>
          <button type="submit" className="btn-primary"><IcSave size={14}/> Lưu Cư Dân</button>
        </div>
      </form>
    </main>
  );
}
