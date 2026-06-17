import { IcBarChart, IcDownload } from '../../components/ui/Icons';
// Reports page: Thống kê và xuất báo cáo
import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useResidents } from '../../context/ResidentContext';
import { api } from '../../utils/api';

Chart.register(...registerables);

export default function Reports() {
  const { residents, showToast, loading } = useResidents();
  const [reportType, setReportType] = useState('tonghop');
  const initialPeriod = `Tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`;
  const [period,     setPeriod]     = useState(initialPeriod);
  const [stats,      setStats]      = useState(null);
  const chartRef  = useRef(null);
  const chartInst = useRef(null);

  const parsePeriod = (value) => {
    const monthMatch = value.match(/Tháng\s+(\d{1,2})\/(\d{4})/i);
    if (monthMatch) {
      return {
        kind: 'month',
        month: Number(monthMatch[1]),
        year: Number(monthMatch[2]),
        label: value,
      };
    }

    const quarterMatch = value.match(/Quý\s+(\d)\/(\d{4})/i);
    if (quarterMatch) {
      return {
        kind: 'quarter',
        quarter: Number(quarterMatch[1]),
        year: Number(quarterMatch[2]),
        label: value,
      };
    }

    return { kind: 'month', month: new Date().getMonth() + 1, year: new Date().getFullYear(), label: value };
  };

  const getResidentDate = (resident) => new Date(resident.regdate || resident.createdAt || Date.now());

  const periodInfo = parsePeriod(period);

  const periodResidents = residents.filter((resident) => {
    const created = getResidentDate(resident);
    if (Number.isNaN(created.getTime())) return false;

    if (periodInfo.kind === 'month') {
      return created.getFullYear() === periodInfo.year && created.getMonth() + 1 === periodInfo.month;
    }

    const startMonth = (periodInfo.quarter - 1) * 3 + 1;
    const endMonth = startMonth + 2;
    return created.getFullYear() === periodInfo.year && (created.getMonth() + 1) >= startMonth && (created.getMonth() + 1) <= endMonth;
  });

  // Fetch stats từ API
  useEffect(() => {
    api.get('/residents/stats').then(setStats).catch(() => setStats(null));
  }, []);

  // Tính số liệu theo kỳ đã chọn
  const total     = periodResidents.length;
  const thuongtru = periodResidents.filter(r => r.status === 'Thường trú').length;
  const tamtru    = periodResidents.filter(r => r.status === 'Tạm trú').length;
  const tamvang   = periodResidents.filter(r => r.status === 'Tạm vắng').length;

  const quarterMonths = periodInfo.kind === 'quarter'
    ? Array.from({ length: 3 }, (_, index) => periodInfo.quarter * 3 - 2 + index)
    : [];

  const countForMonth = (month, status) => residents.filter((resident) => {
    const created = getResidentDate(resident);
    return !Number.isNaN(created.getTime())
      && created.getFullYear() === periodInfo.year
      && created.getMonth() + 1 === month
      && (!status || resident.status === status);
  }).length;

  const chartLabels = periodInfo.kind === 'quarter'
    ? quarterMonths.map((month) => `Tháng ${month}`)
    : [periodInfo.label];

  const chartGroups = periodInfo.kind === 'quarter'
    ? quarterMonths.map((month) => ({
        month,
        thườngTrú: countForMonth(month, 'Thường trú'),
        tạmTrú: countForMonth(month, 'Tạm trú'),
        tạmVắng: countForMonth(month, 'Tạm vắng'),
      }))
    : [{
        month: periodInfo.month,
        thườngTrú: thuongtru,
        tạmTrú: tamtru,
        tạmVắng: tamvang,
      }];

  // Tính nhập/xuất cư từ history thực
  const nhapCu = periodResidents.filter(r =>
    (r.history || []).some(h => h.action?.includes('Thêm mới') || h.action?.includes('Được thêm'))
  ).length;
  const xuatCu = periodResidents.filter(r =>
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

    const labels = chartLabels;
    const thuongtruData = chartGroups.map((group) => group.thườngTrú);
    const tamtruData = chartGroups.map((group) => group.tạmTrú);
    const tamvangData = chartGroups.map((group) => group.tạmVắng);

    chartInst.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Thường trú', data: thuongtruData, backgroundColor: '#22c47a', borderRadius: 10, barThickness: 28, maxBarThickness: 36 },
          { label: 'Tạm trú',    data: tamtruData,    backgroundColor: '#f5a623', borderRadius: 10, barThickness: 28, maxBarThickness: 36 },
          { label: 'Tạm vắng',   data: tamvangData,   backgroundColor: '#f05b5b', borderRadius: 10, barThickness: 28, maxBarThickness: 36 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        layout: { padding: { top: 8, right: 12, bottom: 4, left: 4 } },
        plugins: {
          legend: { position: 'top', labels: { color: '#2d3250', font: { size: 12, weight: '600' }, usePointStyle: true, pointStyle: 'rectRounded' } },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            titleColor: '#fff',
            bodyColor: '#e2e8f0',
            padding: 12,
            cornerRadius: 10,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 12, weight: '600' } },
          },
          y: {
            beginAtZero: true,
            grid: { color: '#e2e8f0', borderDash: [4, 4] },
            ticks: { color: '#64748b', font: { size: 12 }, precision: 0 },
          },
        },
      },
    });

    return () => { chartInst.current?.destroy(); };
  }, [reportType, period, stats, thuongtru, tamtru, tamvang]);

  // Generate dynamic periods for the last 6 months + Quarters
  const dynamicPeriods = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    dynamicPeriods.push(`Tháng ${d.getMonth() + 1}/${d.getFullYear()}`);
  }
  const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
  dynamicPeriods.push(`Quý ${currentQuarter}/${now.getFullYear()}`);
  if (currentQuarter > 1) {
    dynamicPeriods.push(`Quý ${currentQuarter - 1}/${now.getFullYear()}`);
  } else {
    dynamicPeriods.push(`Quý 4/${now.getFullYear() - 1}`);
  }

  const handleExportPDF = async () => {
    try {
      showToast('Đang tạo file PDF...');
      const blob = await api.getBlob(`/residents/export/pdf?type=${reportType}&period=${encodeURIComponent(period)}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cleanPeriod = period.replace(/[\/\s]+/g, '_');
      a.download = `Bao_Cao_${reportType}_${cleanPeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast('Đã xuất file PDF thành công!');
    } catch (error) {
      showToast(error.message || 'Lỗi xuất file PDF', 'error');
    }
  };

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
              {dynamicPeriods.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
            <button className="btn-primary" onClick={handleExportPDF}><IcDownload size={14}/> Xuất PDF</button>
          </div>
        </div>
      </div>

      {/* Kết quả báo cáo */}
      <div className="card mt-16">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <h3 style={{ margin: 0 }}>{REPORT_TITLES[reportType]}</h3>
          <div className="section-chip" style={{ margin: 0 }}>
            <IcBarChart size={12} /> {periodInfo.label}
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
        <p className="subtitle" style={{ marginTop: '12px' }}>
          {periodInfo.kind === 'quarter'
            ? `Biểu đồ phản ánh đúng từng tháng trong ${periodInfo.label}.`
            : `Dữ liệu đang được tổng hợp theo ${periodInfo.label} từ danh sách cư dân hiện có.`}
        </p>
      </div>
    </main>
  );
}
