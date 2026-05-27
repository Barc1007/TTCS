import { IcBarChart, IcDownload, IcMail } from '../../components/ui/Icons';
// Reports page: Thống kê và xuất báo cáo
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useResidents } from '../../context/ResidentContext';
import { api } from '../../utils/api';

Chart.register(...registerables);

export default function Reports() {
  const { residents, showToast, loading } = useResidents();
  const [reportType, setReportType] = useState('tonghop');
  const [period,     setPeriod]     = useState('Tháng 5/2026');
  const [stats,      setStats]      = useState(null);
  const chartRef  = useRef(null);
  const chartInst = useRef(null);

  // Fetch stats từ API
  useEffect(() => {
    api.get('/residents/stats').then(setStats).catch(() => setStats(null));
  }, []);

  // Tính số liệu thực tế từ danh sách cư dân
  const total     = residents.length;
  const thuongtru = residents.filter(r => r.status === 'Thường trú').length;
  const tamtru    = residents.filter(r => r.status === 'Tạm trú').length;
  const tamvang   = residents.filter(r => r.status === 'Tạm vắng').length;

  // Tính nhập/xuất cư từ history thực
  const nhapCu = residents.filter(r =>
    (r.history || []).some(h => h.action?.includes('Thêm mới'))
  ).length;
  const xuatCu = residents.filter(r =>
    (r.history || []).some(h => h.action?.toLowerCase().includes('xóa') || h.action?.toLowerCase().includes('xuat'))
  ).length;

  const REPORT_TITLES = {
    tonghop: 'Báo Cáo Tổng Hợp Dân Số',
    tamtru:  'Báo Cáo Tạm Trú',
    tamvang: 'Báo Cáo Tạm Vắng',
    biendong:'Báo Cáo Biến Động Dân Số',
  };

  // Khởi tạo biểu đồ cột
  useEffect(() => {
    if (chartInst.current) chartInst.current.destroy();
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    chartInst.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stats?.monthlyStats?.map(m => m.label) ?? ['Th.12','Th.1','Th.2','Th.3','Th.4','Th.5'],
        datasets: [
          { label: 'Thường trú', data: stats?.monthlyStats?.map(m => m.count) ?? [0,0,0,0,0,thuongtru], backgroundColor: '#22c47a', borderRadius: 4 },
          { label: 'Tạm trú',    data: Array(6).fill(0).map((_, i) => i === 5 ? tamtru : 0),   backgroundColor: '#f5a623', borderRadius: 4 },
          { label: 'Tạm vắng',  data: Array(6).fill(0).map((_, i) => i === 5 ? tamvang : 0),  backgroundColor: '#f05b5b', borderRadius: 4 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top', labels: { color: '#2d3250', font: { size: 12, weight: '600' } } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#8b92a9' } },
          y: { grid: { color: '#f0f2f8' }, ticks: { color: '#8b92a9' } },
        },
      },
    });

    return () => { chartInst.current?.destroy(); };
  }, [reportType, period, stats, thuongtru, tamtru, tamvang]);

  const summaryStats = [
    { value: total,     label: 'Tổng dân số' },
    { value: thuongtru, label: 'Thường trú' },
    { value: tamtru,    label: 'Tạm trú' },
    { value: tamvang,   label: 'Tạm vắng' },
    { value: `+${nhapCu}`, label: 'Nhập cư (mới)' },
    { value: xuatCu > 0 ? `-${xuatCu}` : '0', label: 'Xuất cư' },
  ];

  if (loading) {
    return <main className="main-content"><p>Đang tải dữ liệu báo cáo...</p></main>;
  }

  return (
    <main className="main-content">
      <div className="page-header">
        <div>
          <h2>Thống Kê &amp; Báo Cáo</h2>
          <p className="subtitle">Tổng hợp và xuất báo cáo dân số</p>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="card">
        <div className="report-filters">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Loại báo cáo</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="tonghop">Tổng hợp dân số</option>
              <option value="tamtru">Tạm trú</option>
              <option value="tamvang">Tạm vắng</option>
              <option value="biendong">Biến động</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Kỳ báo cáo</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              <option>Tháng 5/2026</option>
              <option>Tháng 4/2026</option>
              <option>Tháng 3/2026</option>
              <option>Quý 1/2026</option>
            </select>
          </div>
          <button className="btn-primary"><IcBarChart size={14}/> Tạo Báo Cáo</button>
        </div>
      </div>

      {/* Kết quả báo cáo */}
      <div className="card mt-16">
        <div className="card-header">
          <h3>{REPORT_TITLES[reportType]} – {period}</h3>
          <div className="btn-group">
            <button className="btn-outline" onClick={() => showToast('Đã xuất file PDF thành công!')}><IcDownload size={14}/> Xuất PDF</button>
            <button className="btn-outline" onClick={() => showToast('Đã xuất file Excel thành công!')}><IcDownload size={14}/> Xuất Excel</button>
            <button className="btn-secondary" onClick={() => showToast('Đã gửi báo cáo đến cơ quan địa phương!')}><IcMail size={14}/> Gửi Báo Cáo</button>
          </div>
        </div>

        {/* Số liệu tóm tắt */}
        <div className="report-stats">
          {summaryStats.map(s => (
            <div key={s.label} className="report-stat-card">
              <div className="rsc-value">{s.value}</div>
              <div className="rsc-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Biểu đồ cột */}
        <div className="chart-container mt-16">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </main>
  );
}
