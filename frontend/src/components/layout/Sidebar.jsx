import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_MAP, getInitials } from '../../utils/db';
import {
  IcBuilding, IcGrid, IcUsers, IcHome, IcPlane, IcBarChart, IcLogOut, IcUser, IcKey
} from '../ui/Icons';

// Menu cho cán bộ / admin / staff
const NAV_ITEMS_STAFF = [
  {
    section: 'Tổng quan',
    items: [{ path: '/dashboard', Icon: IcGrid, label: 'Tổng quan' }],
  },
  {
    section: 'Quản lý',
    items: [
      { path: '/apartments',Icon: IcBuilding, label: 'Căn Hộ' },
      { path: '/residents', Icon: IcUsers, label: 'Cư Dân' },
      { path: '/tamtru',    Icon: IcHome,  label: 'Tạm Trú' },
      { path: '/tamvang',   Icon: IcPlane, label: 'Tạm Vắng' },
    ],
  },
  {
    section: 'Báo cáo',
    items: [{ path: '/reports', Icon: IcBarChart, label: 'Thống kê & Báo Cáo' }],
  },
  {
    section: 'Cài đặt',
    items: [{ path: '/update-password', Icon: IcKey, label: 'Đổi mật khẩu' }],
  },
];

// Menu cho cư dân (read-only, chỉ xem thông tin của mình)
const NAV_ITEMS_RESIDENT = [
  {
    section: 'Tài khoản',
    items: [
      { path: '/my-profile', Icon: IcUser, label: 'Thông Tin Của Tôi' },
      { path: '/update-password', Icon: IcKey, label: 'Đổi mật khẩu' },
    ],
  },
];

export default function Sidebar({ isOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const { pathname }     = useLocation();

  // Chọn menu phù hợp theo role
  const navItems = user?.role === 'resident' ? NAV_ITEMS_RESIDENT : NAV_ITEMS_STAFF;

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon-sm">
          <IcBuilding size={18} />
        </div>
        <div className="sidebar-logo-text">
          <strong>ResidentIQ</strong>
          <span>{user?.role === 'resident' ? 'Cổng cư dân' : 'Quản lý chung cư'}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {items.map(({ path, Icon, label }) => (
              <button
                key={path}
                className={`nav-item ${isActive(path) ? 'active' : ''}`}
                onClick={() => handleNavigate(path)}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="avatar">{user ? getInitials(user.name) : 'AD'}</div>
          <div>
            <div className="user-name">{user?.name || 'Admin'}</div>
            <div className="user-role">{ROLE_MAP[user?.role] || user?.role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>
          <IcLogOut size={15} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

