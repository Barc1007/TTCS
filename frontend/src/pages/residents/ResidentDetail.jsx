import { IcArrowLeft, IcEdit, IcTrash, IcSave, IcHome, IcPlane } from '../../components/ui/Icons';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useResidents } from '../../context/ResidentContext';
import { formatDate } from '../../utils/db';

// Danh sách trường: cá nhân và cư trú
const PERSONAL_FIELDS = [
  ['Họ và tên',   'name'],
  ['CCCD',        'cccd'],
  ['Ngày sinh',   'dob'],
  ['Giới tính',   'gender'],
  ['Dân tộc',     'ethnic'],
  ['Tôn giáo',    'religion'],
  ['Nghề nghiệp', 'job'],
];
const RESIDENCE_FIELDS = [
  ['Số phòng',         'room'],
  ['Trạng thái',       'status'],
  ['Địa chỉ thường trú','address'],
  ['Quan hệ chủ hộ',   'relation'],
  ['Ngày đăng ký',     'regdate'],
];

// Hiển thị trường ở chế độ xem (read-only)
function FieldView({ label, value }) {
  return (
    <div className="detail-field">
      <div className="detail-label">{label}</div>
      <div className="detail-value">{value || '—'}</div>
    </div>
  );
}

// Hiển thị trường ở chế độ chỉnh sửa
function FieldEdit({ label, fieldKey, value, onChange }) {
  if (fieldKey === 'status') {
    return (
      <div className="detail-field">
        <div className="detail-label">{label}</div>
        <select className="detail-input" value={value}
          onChange={e => onChange(fieldKey, e.target.value)}>
          {['Thường trú', 'Tạm trú', 'Tạm vắng'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (fieldKey === 'gender') {
    return (
      <div className="detail-field">
        <div className="detail-label">{label}</div>
        <select className="detail-input" value={value}
          onChange={e => onChange(fieldKey, e.target.value)}>
          {['Nam', 'Nữ', 'Khác'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  const type = (fieldKey === 'dob' || fieldKey === 'regdate') ? 'date' : 'text';
  return (
    <div className="detail-field">
      <div className="detail-label">{label}</div>
      <input className="detail-input" type={type}
        value={value || ''}
        onChange={e => onChange(fieldKey, e.target.value)} />
    </div>
  );
}

export default function ResidentDetail() {
  const { id }           = useParams();
  const [searchParams]   = useSearchParams();
  const navigate         = useNavigate();
  const { residents, updateResident, deleteResident, openModal } = useResidents();

  const resident = residents.find(r => String(r._id) === String(id));
  const [editMode, setEditMode] = useState(searchParams.get('edit') === '1');
  const [edits,    setEdits]    = useState({});

  useEffect(() => {
    if (resident) setEdits({ ...resident });
  }, [resident, editMode]);

  if (!resident) return (
    <main className="main-content">
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Không tìm thấy cư dân.</p>
      <button className="btn-back" onClick={() => navigate('/residents')}>← Quay lại</button>
    </main>
  );

  const handleChange = (k, v) => setEdits(e => ({ ...e, [k]: v }));
  const handleSave   = () => { updateResident(resident._id, edits); setEditMode(false); };

  const handleDelete = () => {
    openModal(
      `Bạn có chắc muốn xóa cư dân "${resident.name}" không? Hành động này không thể hoàn tác.`,
      () => { deleteResident(resident._id); navigate('/residents'); }
    );
  };

  // Định dạng giá trị hiển thị (ngày tháng)
  const displayVal = (key) => {
    const v = resident[key];
    return (key === 'dob' || key === 'regdate') ? formatDate(v) : v;
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div className="back-row">
          <button className="btn-back" onClick={() => navigate('/residents')}>← Quay lại</button>
          <div>
            <h2>Chi Tiết Cư Dân</h2>
            <p className="subtitle">{editMode ? 'Chỉnh sửa thông tin' : 'Xem chi tiết'}</p>
          </div>
        </div>
        <div className="btn-group">
          <button className="btn-secondary" onClick={() => setEditMode(v => !v)}>
            {editMode ? 'Hủy sửa' : <><IcEdit size={14}/> Chỉnh Sửa</>}
          </button>
          <button className="btn-danger" onClick={handleDelete}><IcTrash size={14}/> Xóa</button>
        </div>
      </div>

      {/* Thông tin 2 cột */}
      <div className="form-grid-2">
        <div className="card">
          <div className="card-header"><h3>Thông Tin Cá Nhân</h3></div>
          <div className="form-body">
            {PERSONAL_FIELDS.map(([label, key]) =>
              editMode
                ? <FieldEdit key={key} label={label} fieldKey={key} value={edits[key]} onChange={handleChange} />
                : <FieldView key={key} label={label} value={displayVal(key)} />
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Thông Tin Cư Trú</h3></div>
          <div className="form-body">
            {RESIDENCE_FIELDS.map(([label, key]) =>
              editMode
                ? <FieldEdit key={key} label={label} fieldKey={key} value={edits[key]} onChange={handleChange} />
                : <FieldView key={key} label={label} value={displayVal(key)} />
            )}
          </div>
        </div>
      </div>

      {/* Lịch sử biến động */}
      <div className="card mt-16">
        <div className="card-header"><h3>Lịch Sử Biến Động</h3></div>
        {(resident.history || []).length ? resident.history.map((item, index) => (
          <div key={index} className="activity-item">
            <span className="badge badge-blue">{item.action}</span>
            <span className="activity-text">{item.by || 'Hệ thống'}</span>
            <span className="time">{formatDate(String(item.at).slice(0, 10))}</span>
          </div>
        )) : (
          <div className="activity-item">
            <span className="badge badge-gray">Trống</span>
            <span>Chưa có lịch sử biến động</span>
          </div>
        )}
      </div>

      {/* Các nút hành động */}
      <div className="form-actions mt-16"
        style={{ background: 'transparent', border: 'none', paddingLeft: 0, paddingRight: 0 }}>
        <button className="btn-outline" onClick={() => navigate('/tamtru')}><IcHome size={14}/> Đăng Ký Tạm Trú</button>
        <button className="btn-outline" onClick={() => navigate('/tamvang')}><IcPlane size={14}/> Đăng Ký Tạm Vắng</button>
        {editMode && (
          <button className="btn-primary" onClick={handleSave}><IcSave size={14}/> Lưu Thay Đổi</button>
        )}
      </div>
    </main>
  );
}
