import { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { useAuth } from '../../context/AuthContext';
import { useResidents } from '../../context/ResidentContext';
import { getGreeting } from '../../utils/db';
import { api } from '../../utils/api';
import { IcUsers, IcHome, IcPlane, IcClipboard, IcTrendUp, IcCalendar } from '../../components/ui/Icons';

Chart.register(...registerables);

// Tính thời gian tương đối (vd: "2 giờ trước")
function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Vừa xong';
  if (mins < 60)  return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
}

// Màu dot theo loại hành động
function dotColor(action = '') {
  if (action.includes('tạm trú'))   return '#f59e0b';
  if (action.includes('tạm vắng'))  return '#ef4444';
  if (action.includes('Thêm mới') || action.includes('thường trú')) return '#22c55e';
  if (action.includes('Cập nhật'))  return '#3b82f6';
  if (action.includes('xóa'))       return '#94a3b8';
  return '#94a3b8';
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, trend, trendUp }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrap" style={{ background: iconBg }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        <div className={`stat-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user }      = useAuth();
  const { residents, loading } = useResidents();
  const [stats, setStats]       = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const popupRef   = useRef(null);
  const donutRef   = useRef(null);
  const popupChart = useRef(null);
  const donutChart = useRef(null);

  const total     = residents.length;
  const thuongtru = residents.filter(r => r.status === 'Thường trú').length;
  const tamtru    = residents.filter(r => r.status === 'Tạm trú').length;
  const tamvang   = residents.filter(r => r.status === 'Tạm vắng').length;
  const khongo    = residents.filter(r => r.status === 'Không ở').length;

  const greeting  = getGreeting();
  const firstName = user?.name?.split(' ').pop() || 'Admin';
  const dateStr   = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Fetch stats từ API
  useEffect(() => {
    (async () => {
      try {
        setStatsLoading(true);
        const data = await api.get('/residents/stats');
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  // Vẽ biểu đồ khi stats load xong
  useEffect(() => {
    popupChart.current?.destroy();
    donutChart.current?.destroy();

    const popCtx = popupRef.current?.getContext('2d');
    const doCtx  = donutRef.current?.getContext('2d');
    if (!popCtx || !doCtx) return;

    const monthLabels = stats?.monthlyStats?.map(m => m.label) ?? ['Th.12','Th.1','Th.2','Th.3','Th.4','Th.5'];
    const monthData   = stats?.monthlyStats?.map(m => m.count) ?? [0,0,0,0,0,total];

    const grad = popCtx.createLinearGradient(0, 0, 0, 240);
    grad.addColorStop(0, 'rgba(59,130,246,0.15)');
    grad.addColorStop(1, 'rgba(59,130,246,0.01)');

    popupChart.current = new Chart(popCtx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Tổng cư dân',
          data: monthData,
          borderColor: '#3b82f6', backgroundColor: grad,
          borderWidth: 2, tension: 0.4, fill: true,
          pointBackgroundColor: '#3b82f6', pointRadius: 4,
          pointBorderColor: '#fff', pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 11 } }, beginAtZero: false },
        },
      },
    });

    donutChart.current = new Chart(doCtx, {
      type: 'doughnut',
      data: {
        labels: ['Thường trú', 'Tạm trú', 'Tạm vắng', 'Không ở'],
        datasets: [{
          data: [thuongtru, tamtru, tamvang, khongo],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'],
          borderWidth: 3, borderColor: '#fff', hoverOffset: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#0f172a', padding: 14, font: { size: 12, weight: '500' } } } },
        cutout: '70%',
      },
    });

    return () => { popupChart.current?.destroy(); donutChart.current?.destroy(); };
  }, [stats, total, thuongtru, tamtru, tamvang]);

  // Stat cards — so sánh với tháng trước từ monthlyStats
  const prevTotal = stats?.monthlyStats?.[4]?.count ?? total;
  const statCards = [
    { icon: IcUsers,     iconBg: '#eff6ff', iconColor: '#3b82f6', value: total,     label: 'Tổng cư dân', trend: `${total - prevTotal >= 0 ? '+' : ''}${total - prevTotal} so với tháng trước`,     trendUp: total - prevTotal >= 0 },
    { icon: IcHome,      iconBg: '#f0fdf4', iconColor: '#22c55e', value: thuongtru, label: 'Thường trú',  trend: `${thuongtru} cư dân đang thường trú`,  trendUp: true },
    { icon: IcClipboard, iconBg: '#fff7ed', iconColor: '#f97316', value: tamtru,    label: 'Tạm trú',     trend: `${tamtru} cư dân đang tạm trú`,    trendUp: true },
    { icon: IcPlane,     iconBg: '#fef2f2', iconColor: '#ef4444', value: tamvang,   label: 'Tạm vắng',    trend: `${tamvang} cư dân đang tạm vắng`,   trendUp: false },
    { icon: IcUsers,     iconBg: '#f1f5f9', iconColor: '#64748b', value: khongo,    label: 'Không ở',     trend: `${khongo} chủ hộ không ở`,          trendUp: false },
  ];

  // Hoạt động gần đây từ API
  const recentActivities = stats?.recentActivities ?? [];

  if (loading || statsLoading) {
    return <main className="main-content"><p>Đang tải dữ liệu...</p></main>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <div className="section-chip">
            <IcTrendUp size={12} /> Tổng quan
          </div>
          <h2>{greeting}, {firstName}</h2>
          <p className="subtitle">Chào mừng bạn trở lại hệ thống quản lý chung cư ResidentIQ</p>
        </div>
        <div className="date-chip">
          <IcCalendar size={13} />
          {dateStr}
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <div><h3>Biến động cư dân</h3><p>6 tháng gần nhất</p></div>
          </div>
          <div className="chart-container"><canvas ref={popupRef}></canvas></div>
        </div>
        <div className="card">
          <div className="card-header">
            <div><h3>Phân bố trạng thái</h3><p>Hiện tại</p></div>
          </div>
          <div className="chart-container"><canvas ref={donutRef}></canvas></div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-header"><h3>Hoạt động gần đây</h3></div>
        {recentActivities.length === 0 ? (
          <div className="activity-item" style={{ color: 'var(--text-muted)' }}>Chưa có hoạt động nào.</div>
        ) : recentActivities.map((a, i) => {
          const action = String(a.action || '').replace(/\s*bởi\s+Seeder\b/gi, '').replace(/Seeder/gi, '').trim();
          const by = String(a.by || '').replace(/Seeder/gi, '').trim();
          return (
          <div key={i} className="activity-item">
            <span className="activity-dot" style={{ background: dotColor(action) }}></span>
            <span className="activity-text">
              <strong>{a.name}</strong> — {action}
              {by && by !== 'Hệ thống' ? <> bởi <em>{by}</em></> : null}
            </span>
            <span className="time">{timeAgo(a.at)}</span>
          </div>
          );
        })}
      </div>
    </main>
  );
}
