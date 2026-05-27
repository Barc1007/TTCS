import Resident from '../models/Resident.js';
import mongoose from 'mongoose';

function addHistory(resident, action, by = 'Hệ thống') {
  resident.history.push({ action, by, at: new Date() });
}

export async function getResidentStats(_req, res) {
  // Thống kê tổng hợp
  const allResidents = await Resident.find({}, 'status createdAt history name');

  const total     = allResidents.length;
  const thuongtru = allResidents.filter(r => r.status === 'Thường trú').length;
  const tamtru    = allResidents.filter(r => r.status === 'Tạm trú').length;
  const tamvang   = allResidents.filter(r => r.status === 'Tạm vắng').length;

  // Thống kê theo tháng (6 tháng gần nhất)
  const now = new Date();
  const monthlyStats = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const label = `Th.${d.getMonth() + 1}`;
    const count = allResidents.filter(r => new Date(r.createdAt) <= endOfMonth).length;
    monthlyStats.push({ label, count });
  }

  // Lịch sử hoạt động gần đây (gộp tất cả history từ residents, lấy 10 mục mới nhất)
  const activities = [];
  for (const resident of allResidents) {
    for (const h of resident.history || []) {
      activities.push({
        name: resident.name,
        action: h.action,
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
    monthlyStats,
    recentActivities,
  });
}

export async function listResidents(_req, res) {
  const residents = await Resident.find().sort({ createdAt: -1 });
  res.json({ residents });
}

export async function getResidentById(req, res) {
  const resident = await Resident.findById(req.params.id);
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }
  res.json({ resident });
}

export async function createResident(req, res) {
  const { cccd, name, dob, gender, room, status, address, ethnic, religion, job, relation, regdate } = req.body;

  if (!cccd || !name || !dob || !gender || !room || !regdate) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
  }

  const existed = await Resident.findOne({ cccd });
  if (existed) {
    return res.status(409).json({ message: 'CCCD đã tồn tại trong hệ thống' });
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
    relation: relation || 'Chủ hộ',
    regdate,
    history: [{ action: 'Thêm mới cư dân', by: req.user?.name || 'Hệ thống', at: new Date() }],
  });

  res.status(201).json({ message: 'Thêm cư dân thành công', resident });
}

export async function updateResident(req, res) {
  const resident = await Resident.findById(req.params.id);
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  Object.assign(resident, req.body);
  addHistory(resident, 'Cập nhật thông tin cư dân', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Cập nhật cư dân thành công', resident });
}

export async function deleteResident(req, res) {
  const resident = await Resident.findById(req.params.id);
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  await resident.deleteOne();
  res.json({ message: 'Xóa cư dân thành công' });
}

export async function registerTamTru(req, res) {
  const resident = await Resident.findById(req.params.id);
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  const { address, start, end, reason, phone } = req.body;
  if (!address || !start || !end || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin tạm trú' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
  }
  if (resident.status === 'Tạm vắng') {
    return res.status(409).json({ message: 'Cư dân đang tạm vắng, không thể đăng ký tạm trú' });
  }

  resident.status = 'Tạm trú';
  resident.tamTru = { address, start, end, reason: reason || '', phone };
  addHistory(resident, 'Đăng ký tạm trú', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Đăng ký tạm trú thành công', resident });
}

export async function registerTamVang(req, res) {
  const resident = await Resident.findById(req.params.id);
  if (!resident) {
    return res.status(404).json({ message: 'Không tìm thấy cư dân' });
  }

  const { destination, start, end, reason, phone } = req.body;
  if (!destination || !start || !end || !phone) {
    return res.status(400).json({ message: 'Thiếu thông tin tạm vắng' });
  }
  if (end < start) {
    return res.status(400).json({ message: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu' });
  }
  if (resident.status === 'Tạm trú') {
    return res.status(409).json({ message: 'Cư dân đang tạm trú, cần kết thúc tạm trú trước' });
  }

  resident.status = 'Tạm vắng';
  resident.tamVang = { destination, start, end, reason: reason || '', phone };
  addHistory(resident, 'Đăng ký tạm vắng', req.user?.name || 'Hệ thống');
  await resident.save();

  res.json({ message: 'Đăng ký tạm vắng thành công', resident });
}
