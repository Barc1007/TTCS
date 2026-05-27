// UI component: Hộp thoại xác nhận xóa
import { useResidents } from '../../context/ResidentContext';

export default function Modal() {
  const { modal, closeModal } = useResidents();
  if (!modal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Xác nhận xóa</h3>
        <p>{modal.msg}</p>
        <div className="form-actions" style={{ border: 'none', padding: 0, background: 'transparent' }}>
          <button className="btn-secondary" onClick={closeModal}>Hủy</button>
          <button className="btn-danger" onClick={() => { modal.onConfirm(); closeModal(); }}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
