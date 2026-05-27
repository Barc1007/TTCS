// UI component: Badge hiển thị trạng thái cư dân
export default function StatusBadge({ status }) {
  const map = {
    'Thường trú': 'badge-green',
    'Tạm trú':    'badge-yellow',
    'Tạm vắng':   'badge-red',
  };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}
