import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { formatDate } from '../../utils/db';
import {
  IcUser, IcHome, IcPlane, IcCalendar, IcActivity, IcBuilding,
} from '../../components/ui/Icons';

const STATUS_CONFIG = {
  'Thường trú': { label: 'Thường trú', color: '#22c47a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Tạm trú':    { label: 'Tạm trú',    color: '#f5a623', bg: '#fffbeb', border: '#fde68a' },
  'Tạm vắng':   { label: 'Tạm vắng',   color: '#f05b5b', bg: '#fff1f2', border: '#fecdd3' },
};

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f1f3f8' }}>
      <span style={{ width: 160, fontSize: 13, color: '#8b92a9', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: '#1e2a45', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, border: '1px solid #e8eaf2',
      padding: '20px 24px', marginBottom: 20,
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg,#2d3250,#424769)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color: '#fff' }} />
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e2a45', margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function MyProfile() {
  const [resident, setResident] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.get('/residents/me')
      .then(data => setResident(data.resident))
      .catch(() => setError('Không thể tải thông tin cư trú. Vui lòng thử lại sau.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e8eaf2', borderTop: '3px solid #2d3250', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#8b92a9', fontSize: 14 }}>Đang tải thông tin...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: '0 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <p style={{ color: '#f05b5b', fontWeight: 600, marginBottom: 8 }}>{error}</p>
      </main>
    );
  }

  const statusCfg = STATUS_CONFIG[resident?.status] || STATUS_CONFIG['Thường trú'];

  return (
    <main className="main-content">
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IcUser size={22} />
            Thông Tin Cư Trú Của Tôi
          </h1>
          <p className="page-subtitle">Thông tin hồ sơ cư trú đã được đăng ký trong hệ thống</p>
        </div>

        {/* Status badge lớn */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: statusCfg.bg, border: `1.5px solid ${statusCfg.border}`,
          borderRadius: 50, padding: '8px 20px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusCfg.color, display: 'inline-block' }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: statusCfg.color }}>{statusCfg.label}</span>
        </div>
      </div>

      {/* Thông tin cá nhân */}
      <SectionCard icon={IcUser} title="Thông Tin Cá Nhân">
        <InfoRow label="Họ và tên"     value={resident?.name} />
        <InfoRow label="Số CCCD"       value={resident?.cccd} />
        <InfoRow label="Ngày sinh"     value={formatDate(resident?.dob)} />
        <InfoRow label="Giới tính"     value={resident?.gender} />
        <InfoRow label="Dân tộc"       value={resident?.ethnic} />
        <InfoRow label="Tôn giáo"      value={resident?.religion} />
        <InfoRow label="Nghề nghiệp"   value={resident?.job} />
        <InfoRow label="Quan hệ chủ hộ" value={resident?.relation} />
      </SectionCard>

      {/* Thông tin cư trú */}
      <SectionCard icon={IcBuilding} title="Thông Tin Cư Trú">
        <InfoRow label="Phòng / Căn hộ" value={resident?.room} />
        <InfoRow label="Địa chỉ thường trú" value={resident?.address} />
        <InfoRow label="Trạng thái"     value={resident?.status} />
        <InfoRow label="Ngày đăng ký"   value={formatDate(resident?.regdate)} />
      </SectionCard>

      {/* Tạm trú (chỉ hiện nếu đang tạm trú) */}
      {resident?.status === 'Tạm trú' && resident?.tamTru && (
        <SectionCard icon={IcHome} title="Thông Tin Tạm Trú">
          <div style={{
            background: '#fffbeb', border: '1px solid #fde68a',
            borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#92400e',
          }}>
            Bạn đang trong thời gian tạm trú. Thông tin sẽ được cập nhật khi hết hạn.
          </div>
          <InfoRow label="Địa chỉ tạm trú" value={resident.tamTru.address} />
          <InfoRow label="Từ ngày"          value={formatDate(resident.tamTru.start)} />
          <InfoRow label="Đến ngày"         value={formatDate(resident.tamTru.end)} />
          <InfoRow label="Lý do"            value={resident.tamTru.reason} />
          <InfoRow label="Số điện thoại"    value={resident.tamTru.phone} />
        </SectionCard>
      )}

      {/* Tạm vắng (chỉ hiện nếu đang tạm vắng) */}
      {resident?.status === 'Tạm vắng' && resident?.tamVang && (
        <SectionCard icon={IcPlane} title="Thông Tin Tạm Vắng">
          <div style={{
            background: '#fff1f2', border: '1px solid #fecdd3',
            borderRadius: 10, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: '#9f1239',
          }}>
            Bạn đang trong thời gian tạm vắng.
          </div>
          <InfoRow label="Nơi đến"       value={resident.tamVang.destination} />
          <InfoRow label="Từ ngày"       value={formatDate(resident.tamVang.start)} />
          <InfoRow label="Đến ngày"      value={formatDate(resident.tamVang.end)} />
          <InfoRow label="Lý do"         value={resident.tamVang.reason} />
          <InfoRow label="Số điện thoại" value={resident.tamVang.phone} />
        </SectionCard>
      )}

      {/* Lịch sử biến động */}
      {resident?.history?.length > 0 && (
        <SectionCard icon={IcActivity} title="Lịch Sử Biến Động">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[...resident.history].reverse().map((h, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '12px 0',
                borderBottom: i < resident.history.length - 1 ? '1px solid #f1f3f8' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <IcCalendar size={14} style={{ color: '#2d3250' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1e2a45', margin: '0 0 2px' }}>{h.action}</p>
                  <p style={{ fontSize: 12, color: '#8b92a9', margin: 0 }}>
                    Thực hiện bởi: <span style={{ color: '#2d3250' }}>{h.by}</span>
                    &nbsp;·&nbsp;
                    {h.at ? new Date(h.at).toLocaleString('vi-VN') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Ghi chú */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#b0b7c9', marginTop: 8 }}>
        Nếu thông tin không chính xác, vui lòng liên hệ cán bộ quản lý để được hỗ trợ.
      </p>
    </main>
  );
}
