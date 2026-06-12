import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResidents } from '../../context/ResidentContext';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/ui/StatusBadge';
import { IcEye, IcEdit, IcTrash, IcPlus } from '../../components/ui/Icons';
import { formatDate } from '../../utils/db';

export default function ResidentList() {
  const { residents, openModal, deleteResident, loading } = useResidents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const canEdit   = user?.role === 'admin' || user?.role === 'staff';
  const canDelete = user?.role === 'admin';
  const [query,  setQuery]  = useState('');
  const [filter, setFilter] = useState('');

  const filtered = residents.filter(r => {
    const matchQ = r.name.toLowerCase().includes(query.toLowerCase()) || r.cccd.includes(query);
    const matchF = !filter || r.status === filter;
    return matchQ && matchF;
  });

  const handleDelete = (r) => {
    openModal(
      `Bạn có chắc muốn xóa cư dân "${r.name}" không? Hành động này không thể hoàn tác.`,
      () => deleteResident(r._id)
    );
  };

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h2>Quản Lý Cư Dân</h2>
          <p className="subtitle">Danh sách tất cả cư dân trong khu</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/residents/add')}>
          <IcPlus size={15} /> Thêm Cư Dân
        </button>
      </div>

      <div className="card">
        <div className="search-bar">
          <input className="search-input" type="text"
            placeholder="Tìm theo họ tên hoặc CCCD..."
            value={query} onChange={e => setQuery(e.target.value)} />
          <select className="select-input" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="Thường trú">Thường trú</option>
            <option value="Tạm trú">Tạm trú</option>
            <option value="Tạm vắng">Tạm vắng</option>
          </select>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Họ và tên</th><th>CCCD</th><th>Ngày sinh</th>
                <th>Giới tính</th><th>Phòng</th><th>Trạng thái</th><th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 20 }}>Đang tải dữ liệu...</td></tr>
              ) : filtered.map((r, i) => (
                <tr key={r._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td><strong>{r.name}</strong></td>
                  <td><code style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg3)', padding: '2px 6px', borderRadius: 4 }}>{r.cccd}</code></td>
                  <td>{formatDate(r.dob)}</td>
                  <td>{r.gender}</td>
                  <td><span style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 6, fontSize: 12 }}>{r.room}</span></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <button className="action-btn action-view" onClick={() => navigate(`/residents/${r._id}`)}>
                      <IcEye size={12} /> Xem
                    </button>
                    {canEdit && (
                      <button className="action-btn action-edit" onClick={() => navigate(`/residents/${r._id}?edit=1`)}>
                        <IcEdit size={12} /> Sửa
                      </button>
                    )}
                    {canDelete && (
                      <button className="action-btn action-del" onClick={() => handleDelete(r)}>
                        <IcTrash size={12} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">Hiển thị {filtered.length} cư dân</div>
      </div>
    </main>
  );
}
