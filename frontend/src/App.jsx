/**
 * App.jsx – Root của ứng dụng
 *
 * Luồng hoạt động:
 *  1. BrowserRouter  → cung cấp routing cho toàn app
 *  2. AuthProvider   → cung cấp thông tin đăng nhập (user, login, logout)
 *  3. AuthGate       → kiểm tra đã đăng nhập chưa:
 *       - Chưa đăng nhập → hiển thị trang Login / ForgotPassword
 *       - Đã đăng nhập   → hiển thị app shell (Sidebar + Routes)
 *  4. ResidentProvider → cung cấp state cư dân, toast, modal
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Context providers
import { AuthProvider, useAuth }       from './context/AuthContext';
import { ResidentProvider }             from './context/ResidentContext';

// Layout & UI components
import Sidebar     from './components/layout/Sidebar';
import Toast       from './components/ui/Toast';
import Modal       from './components/ui/Modal';

// Auth pages
import Login           from './pages/auth/Login';
import ForgotPassword  from './pages/auth/ForgotPassword';
import ChangePassword  from './pages/auth/ChangePassword';

// App pages
import Dashboard      from './pages/dashboard/Dashboard';
import ResidentList   from './pages/residents/ResidentList';
import ResidentAdd    from './pages/residents/ResidentAdd';
import ResidentDetail from './pages/residents/ResidentDetail';
import Apartments     from './pages/residents/Apartments';
import TamTru         from './pages/residents/TamTru';
import TamVang        from './pages/residents/TamVang';
import Reports        from './pages/reports/Reports';
import MyProfile      from './pages/residents/MyProfile';
import UpdatePassword from './pages/auth/UpdatePassword';

// ─── Auth Gate ─────────────────────────────────────────────────────────────
// Hiển thị trang auth nếu chưa đăng nhập, app shell nếu đã đăng nhập
function AuthGate() {
  const { user } = useAuth();
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'forgot'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chưa đăng nhập → trang xác thực
  if (!user) {
    if (authPage === 'forgot') return <ForgotPassword onSwitch={setAuthPage} />;
    return                            <Login          onSwitch={setAuthPage} />;
  }

  // Cư dân đăng nhập lần đầu → bắt buộc đổi mật khẩu
  if (user.mustChangePassword) {
    return <ChangePassword />;
  }

  // Đã đăng nhập → app shell với sidebar và routes
  return (
    <ResidentProvider>
      <div className="app-shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <button type="button" className="mobile-sidebar-toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Mở menu điều hướng">
          ☰
        </button>
        {sidebarOpen && <button type="button" className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu" />}
        <Routes>
          {/* ── RESIDENT: chỉ được xem hồ sơ cá nhân ── */}
          {user.role === 'resident' ? (
            <>
              <Route path="/"           element={<Navigate to="/my-profile" replace />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="*"           element={<Navigate to="/my-profile" replace />} />
            </>
          ) : (
            <>
              {/* ── STAFF / ADMIN ── */}
              {/* Redirect mặc định */}
              <Route path="/"              element={<Navigate to="/dashboard" replace />} />

              {/* Dashboard */}
              <Route path="/dashboard"     element={<Dashboard />} />

              {/* Quản lý cư dân */}
              <Route path="/apartments"    element={<Apartments />} />
              <Route path="/residents"     element={<ResidentList />} />
              <Route path="/residents/add" element={<ResidentAdd />} />
              <Route path="/residents/:id" element={<ResidentDetail />} />

              {/* Tạm trú / Tạm vắng */}
              <Route path="/tamtru"        element={<TamTru />} />
              <Route path="/tamvang"       element={<TamVang />} />

              {/* Báo cáo */}
              <Route path="/reports"       element={<Reports />} />

              {/* Đổi mật khẩu */}
              <Route path="/update-password" element={<UpdatePassword />} />

              {/* Fallback */}
              <Route path="*"              element={<Navigate to="/dashboard" replace />} />
            </>
          )}
        </Routes>

        {/* Global UI: Toast notification & Confirm modal */}
        <Toast />
        <Modal />
      </div>
    </ResidentProvider>
  );
}

// ─── App Root ───────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </BrowserRouter>
  );
}
