import Resident from '../models/Resident.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { generateResidentsPDF } from '../services/pdf.service.js';

function addHistory(resident, action, by = 'Hệ thống') {
  resident.history.push({ action, by, at: new Date() });
}

async function autoSoftDeleteExpired() {
  const todayStr = new Date().toISOString().split('T')[0];
  const expiredTamTru = await Resident.find({ status: 'Tạm trú', isDeleted: { $ne: true }, 'tamTru.end': { $lt: todayStr } }, '_id');
  if (expiredTamTru.length > 0) {
    const ids = expiredTamTru.map(r => r._id);
    await Resident.updateMany({ _id: { $in: ids } }, { $set: { isDeleted: true, deletedAt: new Date() } });
    await User.updateMany({ residentId: { $in: ids } }, { $set: { isDeleted: true } });
  }

  // Tự động revert Tạm vắng về Thường trú khi hết hạn
  const expiredTamVang = await Resident.find({ status: 'Tạm vắng', isDeleted: { $ne: true }, 'tamVang.end': { $lt: todayStr } }, '_id');
  if (expiredTamVang.length > 0) {
    const ids = expiredTamVang.map(r => r._id);
    await Resident.updateMany({ _id: { $in: ids } }, { $set: { status: 'Thường trú' } });
  }

  // Tự động kích hoạt Tạm vắng khi đến ngày đi
  const upcomingTamVang = await Resident.find({ status: { $ne: 'Tạm vắng' }, isDeleted: { $ne: true }, 'tamVang.start': { $lte: todayStr }, 'tamVang.end': { $gte: todayStr } }, '_id');
  if (upcomingTamVang.length > 0) {
    const ids = upcomingTamVang.map(r => r._id);
    await Resident.updateMany({ _id: { $in: ids } }, { $set: { status: 'Tạm vắng' } });
  }

  // Tự động kích hoạt Tạm trú khi đến ngày bắt đầu (nếu lưu trước mà chưa đến ngày)
  const upcomingTamTru = await Resident.find({ status: { $ne: 'Tạm trú' }, isDeleted: { $ne: true }, 'tamTru.start': { $lte: todayStr }, 'tamTru.end': { $gte: todayStr }, 'tamTru.address': { $exists: true } }, '_id');
  if (upcomingTamTru.length > 0) {
    const ids = upcomingTamTru.map(r => r._id);
    await Resident.updateMany({ _id: { $in: ids } }, { $set: { status: 'Tạm trú' } });
  }
}

export async function getResidentStats(_req, res) {
  await autoSoftDeleteExpired();

  // Thống kê tổng hợp (Lấy toàn bộ để truy hồi quá khứ)
  const allResidents = await Resident.find({});
  const currentResidents = allResidents.filter(r => !r.isDeleted);

  const total     = currentResidents.length;
  const thuongtru = currentResidents.filter(r => r.status === 'Thường trú').length;
  const tamtru    = currentResidents.filter(r => r.status === 'Tạm trú').length;
  const tamvang   = currentResidents.filter(r => r.status === 'Tạm vắng').length;
  const khongo    = currentResidents.filter(r => r.status === 'Không ở').length;

  // Thống kê theo tháng (6 tháng gần nhất)
  const now = new Date();
  const monthlyStats = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const label = `Th.${d.getMonth() + 1}`;
    const residentsAtTime = allResidents.filter(r => {
      const dateToCompare = r.regdate ? new Date(r.regdate) : new Date(r.createdAt);
      if (dateToCompare > endOfMonth) return false;

      // Xử lý lịch sử Tạm trú
      if (r.status === 'Tạm trú' && r.tamTru && r.tamTru.end) {
        const tamTruEnd = new Date(r.tamTru.end);
        if (tamTruEnd < endOfMonth) return false;
      }

      // Xử lý lịch sử Xóa mềm
      if (r.isDeleted) {
        const delDate = r.deletedAt ? new Date(r.deletedAt) : new Date(r.updatedAt);
        if (delDate <= endOfMonth) return false;
      }
      return true;
    });
    const count = residentsAtTime.length;
    const thuongtruCount = residentsAtTime.filter(r => r.status === 'Thường trú').length;
    const tamtruCount = residentsAtTime.filter(r => r.status === 'Tạm trú').length;
    const tamvangCount = residentsAtTime.filter(r => r.status === 'Tạm vắng').length;
    const khongoCount = residentsAtTime.filter(r => r.status === 'Không ở').length;
    monthlyStats.push({ label, count, thuongtru: thuongtruCount, tamtru: tamtruCount, tamvang: tamvangCount, khongo: khongoCount });
  }

  // Lịch sử hoạt động gần đây (gộp tất cả history từ residents, lấy 10 mục mới nhất)
  const activities = [];
  for (const resident of allResidents) {
    for (const h of resident.history || []) {
      const normalizedAction = /seed|Seeder/i.test(`${h.action} ${h.by}`)
        ? 'Được thêm bởi cán bộ quản lý'
        : h.action.replace(/\s+bởi\s+Seeder\b/i, '').trim();
      activities.push({
        name: resident.name,
        action: normalizedAction,
        by: h.by,
        at: h.at,
      });
    }
  }
  activities.sort((a, b) => new Date(b.at) - new Date(a.at));
  const recentActivities = activities.slice(0, 10);

  res.json({
    total,
    thuongtru,
    tamtru,
    tamvang,
    khongo,
    monthlyStats,
    recentActivities,
  });
}

export async function listResidents(_req, res) {
  await autoSoftDeleteExpired();

  const residents = await Resident.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  res.json({ residents });
}

export async function getResidentById(req, res) {
  const resident = await Resident.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }
  res.json({ resident });
}

export async function createResident(req, res) {
  let { cccd, name, dob, gender, room, status, address, ethnic, religion, job, relation, regdate, email, tamTruEnd } = req.body;

  if (room) {
    room = room.trim().toUpperCase();
  }

  if (!cccd || !name || !dob || !gender || !room || !regdate) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
  }

  if (!/^\d{12}$/.test(cccd)) {
    return res.status(400).json({ message: 'Số CCCD phải đúng 12 chữ số' });
  }

  if (status === 'Tạm vắng') {
    return res.status(400).json({ message: 'Không được đặt trạng thái "Tạm vắng" khi thêm cư dân mới' });
  }

  if (status === 'Tạm trú' && relation === 'Chủ hộ') {
    return res.status(400).json({ message: 'Người tạm trú không thể là Chủ hộ' });
  }

  if (status === 'Tạm trú') {
    if (!tamTruEnd) {
      return res.status(400).json({ message: 'Thiếu ngày kết thúc tạm trú' });
    }
    const startDate = new Date(regdate);
    const endDate = new Date(tamTruEnd);
    if (endDate - startDate > 2 * 365 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Thời hạn tạm trú không được vượt quá 24 tháng (2 năm)' });
    }
  }

  const existed = await Resident.findOne({ cccd });
  if (existed) {
    return res.status(409).json({ message: 'CCCD đã tồn tại trong hệ thống' });
  }

  // Kiểm tra Chủ hộ: mỗi phòng chỉ được có 1 người là Chủ hộ
  if (!relation || relation === 'Chủ hộ') {
    const existingChuHo = await Resident.findOne({ room, relation: 'Chủ hộ', isDeleted: { $ne: true } });
    if (existingChuHo) {
      return res.status(409).json({
        message: `Phòng ${room} đã có Chủ hộ (${existingChuHo.name}). Mỗi phòng chỉ được có 1 Chủ hộ.`,
      });
    }
  }

  const resident = await Resident.create({
    cccd,
    name,
    dob,
    gender,
    room,
    status: status || 'Thường trú',
    address: address || '',
    ethnic: ethnic || 'Kinh',
    religion: religion || 'Không',
    job: job || '',
    email: email && email.includes('@') ? email.toLowerCase() : '',
    relation: relation || 'Chủ hộ',
    regdate,
    tamTru: status === 'Tạm trú' ? { address: address || '', start: regdate, end: tamTruEnd, reason: '', phone: '' } : null,
    history: [{ action: 'Được thêm bởi Cán bộ quản lý', by: 'Cán bộ quản lý', at: new Date() }],
    isDeleted: (status === 'Tạm trú' && tamTruEnd && tamTruEnd < new Date().toISOString().split('T')[0]) ? true : false,
    deletedAt: (status === 'Tạm trú' && tamTruEnd && tamTruEnd < new Date().toISOString().split('T')[0]) ? new Date() : null,
  });

  const defaultPassword = cccd.slice(-8);           // 8 số cuối CCCD là mật khẩu mặc định
  const passwordHash    = await bcrypt.hash(defaultPassword, 10);

  // Dùng email thật nếu có, không thì dùng placeholder
  const userEmail = email && email.includes('@') ? email.toLowerCase() : `${cccd}@resident.local`;

  // Kiểm tra email có bị trùng không
  if (email && email.includes('@')) {
    const existingEmail = await User.findOne({ email: userEmail });
    if (existingEmail) {
      await Resident.deleteOne({ _id: resident._id }); // rollback resident
      return res.status(409).json({ message: 'Email này đã được sử dụng bởi tài khoản khác' });
    }
  }

  await User.create({
    name,
    username:           cccd,
    email:              userEmail,
    passwordHash,
    role:               'resident',
    residentId:         resident._id,
    mustChangePassword: true,
    isDeleted:          resident.isDeleted,
  });


  res.status(201).json({ message: 'Thêm cư dân thành công', resident });
}

export async function updateResident(req, res) {
  const resident = await Resident.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  if (req.body.room) {
    req.body.room = req.body.room.trim().toUpperCase();
  }

  // Kiểm tra Chủ hộ khi cập nhật: nếu đang đổi relation thành 'Chủ hộ'
  const newRelation = req.body.relation;
  const newRoom     = req.body.room || resident.room;
  if (newRelation === 'Chủ hộ') {
    const existingChuHo = await Resident.findOne({
      room: newRoom,
      relation: 'Chủ hộ',
      isDeleted: { $ne: true },
      _id: { $ne: resident._id },   // loại trừ chính cư dân này
    });
    if (existingChuHo) {
      return res.status(409).json({
        message: `Phòng ${newRoom} đã có Chủ hộ (${existingChuHo.name}). Mỗi phòng chỉ được có 1 Chủ hộ.`,
      });
    }
  }

  // Nếu có cập nhật email → đồng bộ sang User và kiểm tra trùng
  if (req.body.email !== undefined) {
    const newEmail = req.body.email && req.body.email.includes('@')
      ? req.body.email.toLowerCase()
      : null;

    if (newEmail) {
      // Kiểm tra email đã được dùng bởi user khác chưa
      const existingUser = await User.findOne({
        email: newEmail,
        residentId: { $ne: resident._id },
      });
      if (existingUser) {
        return res.status(409).json({ message: 'Email này đã được sử dụng bởi tài khoản khác' });
      }
      // Cập nhật email trong User document
      await User.findOneAndUpdate({ residentId: resident._id }, { email: newEmail });
    }
  }

  Object.assign(resident, req.body);
  if (resident.status === 'Tạm trú' && resident.tamTru?.end && resident.tamTru.end < new Date().toISOString().split('T')[0]) {
    resident.isDeleted = true;
    resident.deletedAt = new Date();
    await User.findOneAndUpdate({ residentId: resident._id }, { isDeleted: true });
  }
  // Cập nhật Tạm vắng nếu đã hết hạn
  if (resident.status === 'Tạm vắng' && resident.tamVang?.end && resident.tamVang.end < new Date().toISOString().split('T')[0]) {
    resident.status = 'Thường trú';
  }

  addHistory(resident, 'Cập nhật thông tin cư dân', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Cập nhật cư dân thành công', resident });
}

export async function deleteResident(req, res) {
  const resident = await Resident.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  // BR-006: Không được xóa cư dân đang tạm trú hoặc tạm vắng
  if (resident.status === 'Tạm trú') {
    return res.status(409).json({ message: 'Không thể xóa cư dân đang trong thời gian tạm trú' });
  }
  if (resident.status === 'Tạm vắng') {
    return res.status(409).json({ message: 'Không thể xóa cư dân đang trong thời gian tạm vắng' });
  }

  // Soft delete tài khoản User liên kết (nếu có)
  await User.findOneAndUpdate({ residentId: resident._id }, { isDeleted: true });

  // Soft delete cư dân
  resident.isDeleted = true;
  resident.deletedAt = new Date();
  addHistory(resident, 'Xóa cư dân (Soft Delete)', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Xóa cư dân thành công' });
}

export async function registerTamTru(req, res) {
  const resident = await Resident.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  const { address, start, end, reason, phone } = req.body;
  if (!address || !start || !end || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin tạm trú' });
  }
  if (!/^0\d{9}$/.test(phone)) {
    return res.status(400).json({ message: 'Số điện thoại phải đúng 10 chữ số và bắt đầu bằng 0' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
  }
  if (start < resident.regdate) {
    return res.status(400).json({ message: `Ngày bắt đầu không được nhỏ hơn Ngày đăng ký cư trú (${resident.regdate})` });
  }
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (endDate - startDate > 2 * 365 * 24 * 60 * 60 * 1000) {
    return res.status(400).json({ message: 'Thời hạn tạm trú không được vượt quá 24 tháng (2 năm)' });
  }
  if (resident.status === 'Tạm vắng') {
    return res.status(409).json({ message: 'Cư dân đang tạm vắng, không thể đăng ký tạm trú' });
  }

  resident.tamTru = { address, start, end, reason: reason || '', phone };
  if (start <= new Date().toISOString().split('T')[0]) {
    resident.status = 'Tạm trú';
  }
  if (end < new Date().toISOString().split('T')[0]) {
    resident.isDeleted = true;
    resident.deletedAt = new Date();
    await User.findOneAndUpdate({ residentId: resident._id }, { isDeleted: true });
  }
  addHistory(resident, 'Đăng ký tạm trú', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Đăng ký tạm trú thành công', resident });
}

export async function registerTamVang(req, res) {
  const resident = await Resident.findOne({ _id: req.params.id, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  const { destination, start, end, reason, phone } = req.body;
  if (!destination || !start || !end || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin tạm vắng' });
  }
  if (!/^0\d{9}$/.test(phone)) {
    return res.status(400).json({ message: 'Số điện thoại phải đúng 10 chữ số và bắt đầu bằng 0' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
  }
  if (start < resident.regdate) {
    return res.status(400).json({ message: `Ngày đi không được nhỏ hơn Ngày đăng ký cư trú (${resident.regdate})` });
  }
  if (resident.status === 'Tạm trú') {
    return res.status(409).json({ message: 'Cư dân đang tạm trú, cần kết thúc tạm trú trước' });
  }

  resident.tamVang = { destination, start, end, reason: reason || '', phone };
  if (start <= new Date().toISOString().split('T')[0]) {
    resident.status = 'Tạm vắng';
  }
  addHistory(resident, 'Đăng ký tạm vắng', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Đăng ký tạm vắng thành công', resident });
}

// GET /residents/me – cư dân xem thông tin cư trú của chính mình
export async function getMyResidentInfo(req, res) {
  if (!req.user.residentId) {
    return res.status(404).json({ message: 'Tài khoản này chưa liên kết với hồ sơ cư dân nào' });
  }

  const resident = await Resident.findOne({ _id: req.user.residentId, isDeleted: { $ne: true } });
  if (!resident) {
    return res.status(404).json({ message: 'Hồ sơ cư dân không tồn tại' });
  }

  res.json({ resident });
}

function parsePeriod(periodStr) {
  let startDate = null;
  let endDate = null;

  if (!periodStr) return { startDate, endDate };

  const monthMatch = periodStr.match(/Tháng\s+(\d+)\/(\d+)/i);
  if (monthMatch) {
    const month = parseInt(monthMatch[1]) - 1; // 0-indexed
    const year = parseInt(monthMatch[2]);
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
  } else {
    const quýMatch = periodStr.match(/Quý\s+(\d+)\/(\d+)/i);
    if (quýMatch) {
      const quý = parseInt(quýMatch[1]);
      const year = parseInt(quýMatch[2]);
      const startMonth = (quý - 1) * 3;
      startDate = new Date(year, startMonth, 1);
      endDate = new Date(year, startMonth + 3, 0, 23, 59, 59, 999);
    }
  }
  return { startDate, endDate };
}

export async function exportResidentsPDF(req, res) {
  try {
    const { type = 'tonghop', period = 'Tháng 5/2026' } = req.query;

    const { startDate, endDate } = parsePeriod(period);

    // Lấy thống kê toàn bộ lịch sử
    const allResidents = await Resident.find({});
    
    // Lọc ra những cư dân được tạo trước hoặc trong kỳ báo cáo
    const validResidents = allResidents.filter(r => {
      const dateToCompare = r.regdate ? new Date(r.regdate) : new Date(r.createdAt);
      if (endDate && dateToCompare > endDate) return false;

      // Xử lý Tạm trú quá hạn
      if (r.status === 'Tạm trú' && r.tamTru && r.tamTru.end) {
        const tamTruEnd = new Date(r.tamTru.end);
        if (endDate && tamTruEnd < endDate) return false;
      }

      // Xử lý người đã bị xóa (Soft Delete)
      if (r.isDeleted) {
        if (endDate) {
          const delDate = r.deletedAt ? new Date(r.deletedAt) : new Date(r.updatedAt);
          if (delDate <= endDate) return false;
        } else {
          return false;
        }
      }
      return true;
    });

    const total = validResidents.length;
    const thuongtru = validResidents.filter(r => r.status === 'Thường trú').length;
    const tamtru = validResidents.filter(r => r.status === 'Tạm trú').length;
    const tamvang = validResidents.filter(r => r.status === 'Tạm vắng').length;
    const stats = { total, thuongtru, tamtru, tamvang };

    let data = [];
    if (type === 'tonghop') {
      data = validResidents.sort((a,b) => a.room.localeCompare(b.room) || a.name.localeCompare(b.name));
    } else if (type === 'tamtru') {
      data = validResidents.filter(r => r.status === 'Tạm trú').sort((a,b) => a.room.localeCompare(b.room) || a.name.localeCompare(b.name));
    } else if (type === 'tamvang') {
      data = validResidents.filter(r => r.status === 'Tạm vắng').sort((a,b) => a.room.localeCompare(b.room) || a.name.localeCompare(b.name));
    } else if (type === 'biendong') {
      for (const r of allResidents) {
        for (const h of r.history || []) {
          const hDate = new Date(h.at);
          if ((!startDate || hDate >= startDate) && (!endDate || hDate <= endDate)) {
            data.push({
              name: r.name,
              cccd: r.cccd,
              room: r.room,
              action: h.action,
              date: hDate.toLocaleDateString('vi-VN'),
              rawDate: hDate,
            });
          }
        }
      }
      data.sort((a, b) => b.rawDate - a.rawDate);
    }

    const pdfBuffer = await generateResidentsPDF(type, period, data, stats);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Bao_Cao_${type}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Lỗi xuất báo cáo PDF' });
  }
}
