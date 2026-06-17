import { useState, useMemo } from 'react';
import { useResidents } from '../../context/ResidentContext';
import { IcBuilding, IcUsers, IcHome } from '../../components/ui/Icons';
import { useNavigate } from 'react-router-dom';

export default function Apartments() {
  const { residents, loading } = useResidents();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Group residents by room
  const rooms = useMemo(() => {
    const map = {};
    for (const r of residents) {
      if (!map[r.room]) {
        map[r.room] = [];
      }
      map[r.room].push(r);
    }
    return Object.keys(map).sort().map(room => ({
      room,
      residents: map[room]
    }));
  }, [residents]);

  if (loading) {
    return <main className="main-content"><p>Đang tải dữ liệu căn hộ...</p></main>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h2>Quản Lý Căn Hộ</h2>
          <p className="subtitle">Danh sách các căn hộ và cư dân tương ứng</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        {rooms.map(item => (
          <div 
            key={item.room} 
            className="stat-card" 
            style={{ cursor: 'pointer', border: selectedRoom === item.room ? '2px solid #3b82f6' : '1px solid #e2e8f0' }}
            onClick={() => setSelectedRoom(item.room === selectedRoom ? null : item.room)}
          >
            <div className="stat-icon-wrap" style={{ background: '#eff6ff' }}>
              <IcBuilding size={22} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="stat-value">{item.room}</div>
              <div className="stat-label">{item.residents.length} Cư dân</div>
            </div>
          </div>
        ))}
        {rooms.length === 0 && <p>Chưa có dữ liệu căn hộ.</p>}
      </div>

      {selectedRoom && (
        <div className="card mt-16">
          <div className="card-header">
            <h3>Chi tiết căn hộ {selectedRoom}</h3>
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
                {rooms.find(r => r.room === selectedRoom)?.residents.map(r => (
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
