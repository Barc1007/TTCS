// UI component: Thông báo nổi góc phải màn hình
import { useResidents } from '../../context/ResidentContext';

export default function Toast() {
  const { toast } = useResidents();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}
