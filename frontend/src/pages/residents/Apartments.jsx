import { useState, useMemo } from 'react';
import { useResidents } from '../../context/ResidentContext';
import { IcBuilding, IcUsers } from '../../components/ui/Icons';
import { useNavigate } from 'react-router-dom';

export default function Household() {
  const { households, loading } = useResidents();
  const navigate = useNavigate();
  const [selectedHousehold, setSelectedHousehold] = useState(null);

  const rooms = useMemo(() => {
    return [...households]
      .map((household) => ({
        ...household,
        residents: household.members || [],
      }))
      .sort((a, b) => String(a.code || '').localeCompare(String(b.code || '')));
  }, [households]);

  if (loading) {
    return <main className="main-content"><p>Đang tải dữ liệu household...</p></main>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h2>Quản Lý Hộ Dân</h2>
          <p className="subtitle">Danh sách hộ dân và cư dân tương ứng</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {rooms.map(item => (
          <div 
            key={item._id}
            className="stat-card" 
            style={{ cursor: 'pointer', border: selectedHousehold === item._id ? '2px solid #3b82f6' : '1px solid #e2e8f0' }}
            onClick={() => setSelectedHousehold(item._id === selectedHousehold ? null : item._id)}
          >
            <div className="stat-icon-wrap" style={{ background: '#eff6ff' }}>
              <IcBuilding size={22} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="stat-value">{item.code}</div>
              <div className="stat-label">{item.residents.length} Cư dân</div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && <p>Chưa có dữ liệu hộ dân.</p>}
      </div>

      {selectedHousehold && (
        <div className="card mt-16">
          <div className="card-header">
            <h3>Chi tiết hộ dân {rooms.find(r => r._id === selectedHousehold)?.code}</h3>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Họ và tên</th>
                  <th>CCCD</th>
                  <th>Quan hệ</th>
                  <th>Trạng thái</th>
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rooms.find(r => r._id === selectedHousehold)?.residents.map(r => (
                  <tr key={r._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="avatar">{r.name.charAt(0)}</div>
                        <strong>{r.name}</strong>
                      </div>
                    </td>
                    <td>{r.cccd}</td>
                    <td>{r.relation || 'Chủ hộ'}</td>
                    <td>
                      <span className={`status-badge status-${r.status === 'Thường trú' ? 'success' : r.status === 'Tạm trú' ? 'warning' : r.status === 'Tạm vắng' ? 'danger' : 'secondary'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="btn-outline" onClick={() => navigate(`/residents/${r._id}`)}>
                        <IcUsers size={14} /> Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
