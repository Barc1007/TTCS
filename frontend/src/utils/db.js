// ===== DATABASE (localStorage) =====
export const DB = {
  getUsers() {
    const raw = localStorage.getItem('riq_users');
    const users = raw ? JSON.parse(raw) : [];
    if (!users.length) {
      users.push({
        username: 'admin',
        email: 'admin@residentiq.vn',
        password: '123456',
        name: 'Quản trị viên',
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('riq_users', JSON.stringify(users));
    }
    return users;
  },
  saveUsers(users) { localStorage.setItem('riq_users', JSON.stringify(users)); },
  findUser(usernameOrEmail) {
    return this.getUsers().find(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
  },
  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  },
  updatePassword(usernameOrEmail, newPass) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.username === usernameOrEmail || u.email === usernameOrEmail);
    if (idx !== -1) { users[idx].password = newPass; this.saveUsers(users); return true; }
    return false;
  },
  setSession(user) {
    localStorage.setItem('riq_session', JSON.stringify({
      username: user.username, name: user.name, role: user.role, email: user.email,
    }));
  },
  getSession() {
    const s = localStorage.getItem('riq_session');
    return s ? JSON.parse(s) : null;
  },
  clearSession() { localStorage.removeItem('riq_session'); },
};

export const ROLE_MAP = { admin: 'Cán bộ Quản lý', staff: 'Nhân viên', viewer: 'Người xem' };

export function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
}

export function formatDate(d) {
  if (!d) return '';
  const [y, m, dd] = d.split('-');
  return `${dd}/${m}/${y}`;
}

export function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase();
}
