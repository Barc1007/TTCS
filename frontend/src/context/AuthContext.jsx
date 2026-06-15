import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('riq_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        setUser(data.user);
      } catch {
        localStorage.removeItem('riq_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (usernameOrEmail, password) => {
    const data = await api.post('/auth/login', { usernameOrEmail, password });
    localStorage.setItem('riq_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await api.post('/auth/register', payload);
    localStorage.setItem('riq_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('riq_token');
    setUser(null);
  };

  // Dành cho cư dân đổi mật khẩu lần đầu (mustChangePassword = true)
  const changePassword = async (newPassword) => {
    await api.post('/auth/change-password', { newPassword });
    // Tắt cờ bắt buộc đổi mật khẩu trong state local
    setUser(prev => ({ ...prev, mustChangePassword: false }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
