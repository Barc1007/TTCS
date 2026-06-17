import fs from 'fs';
import path from 'path';
import https from 'https';
import PDFDocument from 'pdfkit';

const FONT_DIR = path.resolve('src/assets/fonts');
const FONT_REGULAR_PATH = path.join(FONT_DIR, 'Roboto-Regular.ttf');
const FONT_BOLD_PATH = path.join(FONT_DIR, 'Roboto-Bold.ttf');

const FONT_REGULAR_URL = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Regular.ttf';
const FONT_BOLD_URL = 'https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/roboto/static/Roboto-Bold.ttf';

/**
 * Downloads a file from a URL, following HTTP redirects if necessary.
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    function getUrl(targetUrl) {
      https.get(targetUrl, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          getUrl(response.headers.location);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Tải font thất bại: Status ${response.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(dest, () => reject(err));
      });
    }
    getUrl(url);
  });
}

/**
 * Ensures that Roboto regular and bold fonts are available locally, or falls back to system fonts.
 */
export async function ensureFontsExist() {
  if (!fs.existsSync(FONT_DIR)) {
    fs.mkdirSync(FONT_DIR, { recursive: true });
  }

  // 1. Cố gắng tải font Roboto từ CDN nếu chưa có
  if (!fs.existsSync(FONT_REGULAR_PATH)) {
    console.log('Downloading Roboto-Regular.ttf for PDF export from CDN...');
    try {
      await downloadFile(FONT_REGULAR_URL, FONT_REGULAR_PATH);
    } catch (err) {
      console.warn('Failed to download Roboto-Regular.ttf:', err.message);
    }
  }

  if (!fs.existsSync(FONT_BOLD_PATH)) {
    console.log('Downloading Roboto-Bold.ttf for PDF export from CDN...');
    try {
      await downloadFile(FONT_BOLD_URL, FONT_BOLD_PATH);
    } catch (err) {
      console.warn('Failed to download Roboto-Bold.ttf:', err.message);
    }
  }

  // 2. Nếu đã có đầy đủ font Roboto local thì sử dụng
  if (fs.existsSync(FONT_REGULAR_PATH) && fs.existsSync(FONT_BOLD_PATH)) {
    return {
      regular: FONT_REGULAR_PATH,
      bold: FONT_BOLD_PATH
    };
  }

  // 3. Fallback sang Windows system Arial fonts nếu mất kết nối/lỗi tải
  const winRegular = 'C:\\Windows\\Fonts\\arial.ttf';
  const winBold = 'C:\\Windows\\Fonts\\arialbd.ttf';
  if (fs.existsSync(winRegular) && fs.existsSync(winBold)) {
    console.log('Fallback: Sử dụng font hệ thống Arial của Windows.');
    return {
      regular: winRegular,
      bold: winBold
    };
  }

  throw new Error('Không tìm thấy font chữ tiếng Việt hỗ trợ Unicode. Vui lòng kết nối Internet để tải font.');
}

/**
 * Generates a PDF report based on report type, period, and data.
 */
export async function generateResidentsPDF(reportType, period, data, stats) {
  const fontPaths = await ensureFontsExist();

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
      bufferPages: true,
    });

    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on('error', reject);

    // Register Fonts
    doc.registerFont('Roboto-Regular', fontPaths.regular);
    doc.registerFont('Roboto-Bold', fontPaths.bold);

    // 1. Header (Quốc hiệu tiêu ngữ)
    doc.font('Roboto-Bold').fontSize(10).fillColor('#000000').text('HỆ THỐNG QUẢN LÝ DÂN CƯ RESIDENTIQ', 50, 45);
    doc.font('Roboto-Regular').fontSize(9).fillColor('#000000').text('Ban Quản Lý Khu Dân Cư / Chung Cư', 50, 58);

    doc.font('Roboto-Bold').fontSize(10).fillColor('#000000').text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 340, 45, { align: 'center', width: 205 });
    doc.font('Roboto-Bold').fontSize(9).fillColor('#000000').text('Độc lập - Tự do - Hạnh phúc', 340, 58, { align: 'center', width: 205 });
    doc.strokeColor('#cccccc').lineWidth(0.5).moveTo(385, 72).lineTo(500, 72).stroke();

    // 2. Report Title
    let title = 'BÁO CÁO HỆ THỐNG';
    if (reportType === 'tonghop') title = 'BÁO CÁO TỔNG HỢP DÂN SỐ';
    else if (reportType === 'tamtru') title = 'BÁO CÁO CƯ DÂN TẠM TRÚ';
    else if (reportType === 'tamvang') title = 'BÁO CÁO CƯ DÂN TẠM VẮNG';
    else if (reportType === 'biendong') title = 'BÁO CÁO BIẾN ĐỘNG DÂN SỐ';

    doc.font('Roboto-Bold').fontSize(16).fillColor('#000000').text(title, 50, 100, { align: 'center' });
    doc.font('Roboto-Regular').fontSize(10).fillColor('#000000').text(`Kỳ báo cáo: ${period}`, 50, 120, { align: 'center' });

    // 3. Stats Card Box
    doc.fillColor('#f8fafc').strokeColor('#e2e8f0').lineWidth(1)
       .roundedRect(50, 145, 495, 50, 4)
       .fillAndStroke();

    doc.fillColor('#000000').font('Roboto-Bold').fontSize(9);
    if (reportType === 'tonghop') {
      doc.text('TỔNG DÂN SỐ', 65, 157, { width: 100, align: 'center' });
      doc.text('THƯỜNG TRÚ', 185, 157, { width: 100, align: 'center' });
      doc.text('TẠM TRÚ', 305, 157, { width: 100, align: 'center' });
      doc.text('TẠM VẮNG', 425, 157, { width: 100, align: 'center' });

      doc.fillColor('#000000').font('Roboto-Bold').fontSize(14);
      doc.text(String(stats.total || 0), 65, 172, { width: 100, align: 'center' });
      doc.text(String(stats.thuongtru || 0), 185, 172, { width: 100, align: 'center' });
      doc.text(String(stats.tamtru || 0), 305, 172, { width: 100, align: 'center' });
      doc.text(String(stats.tamvang || 0), 425, 172, { width: 100, align: 'center' });
    } else if (reportType === 'tamtru') {
      doc.text('TỔNG SỐ TẠM TRÚ TRONG KỲ', 200, 157, { width: 200, align: 'center' });
      doc.fillColor('#000000').font('Roboto-Bold').fontSize(14);
      doc.text(String(data.length), 200, 172, { width: 200, align: 'center' });
    } else if (reportType === 'tamvang') {
      doc.text('TỔNG SỐ TẠM VẮNG TRONG KỲ', 200, 157, { width: 200, align: 'center' });
      doc.fillColor('#000000').font('Roboto-Bold').fontSize(14);
      doc.text(String(data.length), 200, 172, { width: 200, align: 'center' });
    } else {
      // biendong
      doc.text('TỔNG SỐ LƯỢT BIẾN ĐỘNG', 200, 157, { width: 200, align: 'center' });
      doc.fillColor('#000000').font('Roboto-Bold').fontSize(14);
      doc.text(String(data.length), 200, 172, { width: 200, align: 'center' });
    }

    // 4. Data Table Configuration
    let columns = [];
    if (reportType === 'tonghop') {
      columns = [
        { label: 'STT', width: 30, align: 'center' },
        { label: 'Họ và tên', width: 140 },
        { label: 'Số CCCD', width: 95 },
        { label: 'Phòng', width: 60, align: 'center' },
        { label: 'Quan hệ', width: 85 },
        { label: 'Trạng thái', width: 85, align: 'center' },
      ];
    } else if (reportType === 'tamtru') {
      columns = [
        { label: 'STT', width: 30, align: 'center' },
        { label: 'Họ và tên', width: 110 },
        { label: 'Số CCCD', width: 90 },
        { label: 'Phòng', width: 50, align: 'center' },
        { label: 'Đăng ký từ -> đến', width: 180, align: 'center' },
        { label: 'SĐT liên hệ', width: 35, align: 'center' }, // SĐT fits rest width
      ];
      // adjust widths slightly
      columns[4].width = 145;
      columns[5].width = 70;
    } else if (reportType === 'tamvang') {
      columns = [
        { label: 'STT', width: 30, align: 'center' },
        { label: 'Họ và tên', width: 110 },
        { label: 'Số CCCD', width: 90 },
        { label: 'Phòng', width: 50, align: 'center' },
        { label: 'Vắng từ -> đến', width: 145, align: 'center' },
        { label: 'Nơi đến tạm trú', width: 70 },
      ];
    } else {
      // biendong
      columns = [
        { label: 'STT', width: 30, align: 'center' },
        { label: 'Họ và tên', width: 110 },
        { label: 'Số CCCD', width: 90 },
        { label: 'Phòng', width: 50, align: 'center' },
        { label: 'Hoạt động ghi nhận', width: 135 },
        { label: 'Thời gian', width: 80, align: 'center' },
      ];
    }

    let y = 220;

    const drawHeader = (docY) => {
      let x = 50;
      doc.font('Roboto-Bold').fontSize(9).fillColor('#ffffff');
      
      // Draw Header Background
      doc.fillColor('#000000').rect(50, docY - 5, 495, 22).fill();
      doc.fillColor('#ffffff');

      columns.forEach((col) => {
        doc.text(col.label, x + 5, docY, {
          width: col.width - 10,
          align: col.align || 'left',
        });
        x += col.width;
      });

      doc.strokeColor('#1a3c5e').lineWidth(1).moveTo(50, docY + 17).lineTo(545, docY + 17).stroke();
      return docY + 22;
    };

    // Draw the initial table header
    y = drawHeader(y);

    // Render Data Rows
    data.forEach((item, index) => {
      // Check if we need a new page
      if (y > 700) {
        doc.addPage();
        y = 50;
        y = drawHeader(y);
      }

      let rowValues = [];
      if (reportType === 'tonghop') {
        rowValues = [
          String(index + 1),
          item.name,
          item.cccd,
          item.room,
          item.relation || 'Chủ hộ',
          item.status,
        ];
      } else if (reportType === 'tamtru') {
        rowValues = [
          String(index + 1),
          item.name,
          item.cccd,
          item.room,
          `${item.tamTru?.start || ''} -> ${item.tamTru?.end || ''}`,
          item.tamTru?.phone || '',
        ];
      } else if (reportType === 'tamvang') {
        rowValues = [
          String(index + 1),
          item.name,
          item.cccd,
          item.room,
          `${item.tamVang?.start || ''} -> ${item.tamVang?.end || ''}`,
          item.tamVang?.destination || '',
        ];
      } else {
        // biendong row
        rowValues = [
          String(index + 1),
          item.name,
          item.cccd,
          item.room,
          item.action,
          item.date,
        ];
      }

      // Draw Row
      let x = 50;
      doc.font('Roboto-Regular').fontSize(8.5).fillColor('#000000');
      
      // Draw alternating light blue backgrounds for readable tables
      if (index % 2 === 1) {
        doc.fillColor('#f4f7fa').rect(50, y - 4, 495, 18).fill();
        doc.fillColor('#000000');
      }

      columns.forEach((col, idx) => {
        const val = String(rowValues[idx] || '');
        doc.text(val, x + 5, y, {
          width: col.width - 10,
          align: col.align || 'left',
          ellipsis: true,
          lineBreak: false,
        });
        x += col.width;
      });

      doc.strokeColor('#e2e8f0').lineWidth(0.5).moveTo(50, y + 14).lineTo(545, y + 14).stroke();
      y += 18;
    });

    // 5. Signature section (Ký tên)
    if (y > 650) {
      doc.addPage();
      y = 50;
    }

    y += 20;
    const today = new Date();
    const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
    doc.font('Roboto-Regular').fontSize(9).fillColor('#000000').text(dateStr, 320, y, { align: 'center', width: 225 });
    
    y += 15;
    doc.font('Roboto-Bold').fontSize(10).fillColor('#000000').text('Người lập báo cáo', 320, y, { align: 'center', width: 225 });
    doc.font('Roboto-Regular').fontSize(8.5).fillColor('#000000').text('(Ký và ghi rõ họ tên)', 320, y + 12, { align: 'center', width: 225 });

    // 6. Draw Page Numbers on all pages before ending
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.font('Roboto-Regular').fontSize(8).fillColor('#000000').text(
        `Trang ${i + 1} / ${pages.count}`,
        50,
        800,
        { align: 'center', width: 495 }
      );
    }

    doc.end();
  });
}
