import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const ResidentContext = createContext(null);

export function ResidentProvider({ children }) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadResidents = async () => {
    setLoading(true);
    try {
      const data = await api.get('/residents');
      setResidents(data.residents || []);
    } catch (error) {
      showToast(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  const addResident = async (payload) => {
    const data = await api.post('/residents', payload);
    setResidents((prev) => [data.resident, ...prev]);
    showToast(`✅ Đã thêm cư dân ${data.resident.name}`);
    return data.resident;
  };

  const updateResident = async (id, payload) => {
    const data = await api.put(`/residents/${id}`, payload);
    setResidents((prev) => prev.map((resident) => (resident._id === id ? data.resident : resident)));
    showToast('✅ Đã cập nhật thông tin');
    return data.resident;
  };

  const deleteResident = async (id) => {
    await api.delete(`/residents/${id}`);
    setResidents((prev) => prev.filter((resident) => resident._id !== id));
    showToast('🗑️ Đã xóa cư dân');
  };

  const registerTamTru = async (id, payload) => {
    const data = await api.post(`/residents/${id}/tam-tru`, payload);
    setResidents((prev) => prev.map((resident) => (resident._id === id ? data.resident : resident)));
    showToast('✅ Đăng ký tạm trú thành công!');
    return data.resident;
  };

  const registerTamVang = async (id, payload) => {
    const data = await api.post(`/residents/${id}/tam-vang`, payload);
    setResidents((prev) => prev.map((resident) => (resident._id === id ? data.resident : resident)));
    showToast('✅ Đăng ký tạm vắng thành công!');
    return data.resident;
  };

  const openModal = (msg, onConfirm) => setModal({ msg, onConfirm });
  const closeModal = () => setModal(null);

  return (
    <ResidentContext.Provider
      value={{
        residents,
        loading,
        addResident,
        updateResident,
        deleteResident,
        registerTamTru,
        registerTamVang,
        toast,
        showToast,
        modal,
        openModal,
        closeModal,
        reloadResidents: loadResidents,
      }}
    >
      {children}
    </ResidentContext.Provider>
  );
}

export const useResidents = () => useContext(ResidentContext);
