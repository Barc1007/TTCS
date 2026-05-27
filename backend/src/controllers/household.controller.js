import Household from '../models/Household.js';

export async function listHouseholds(_req, res) {
  const households = await Household.find().populate('headResidentId').sort({ createdAt: -1 });
  res.json({ households });
}

export async function createHousehold(req, res) {
  const { code, apartment, address, headResidentId = null, members = [] } = req.body;

  if (!code || !apartment || !address) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc' });
  }

  const existed = await Household.findOne({ code });
  if (existed) {
    return res.status(409).json({ message: 'Mã hộ gia đình đã tồn tại' });
  }

  const household = await Household.create({ code, apartment, address, headResidentId, members });
  res.status(201).json({ message: 'Tạo hộ gia đình thành công', household });
}
