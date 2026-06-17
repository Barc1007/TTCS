import Household from '../models/Household.js';
import Resident from '../models/Resident.js';

function buildHouseholdFromRoom(room, residents) {
  const sortedResidents = [...residents].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const headResident = sortedResidents.find((resident) => resident.relation === 'Chủ hộ') || sortedResidents[0] || null;
  const address = sortedResidents.find((resident) => resident.address && resident.address.trim())?.address?.trim() || `Phòng ${room}`;

  return {
    code: room,
    apartment: room,
    address,
    headResidentId: headResident?._id || null,
    members: sortedResidents.map((resident) => resident._id),
  };
}

export async function listHouseholds(_req, res) {
  const households = await Household.find().populate('headResidentId').populate('members').sort({ createdAt: -1 });
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

export async function migrateHouseholdsFromResidents(_req, res) {
  const activeResidents = await Resident.find({ isDeleted: { $ne: true } }).sort({ createdAt: 1 });

  const grouped = activeResidents.reduce((acc, resident) => {
    const room = (resident.room || '').trim().toUpperCase();
    if (!room) return acc;
    if (!acc[room]) acc[room] = [];
    acc[room].push(resident);
    return acc;
  }, {});

  const roomCodes = Object.keys(grouped);
  if (roomCodes.length === 0) {
    return res.status(200).json({ message: 'Không có dữ liệu room để migrate', created: 0, updated: 0 });
  }

  let created = 0;
  let updated = 0;

  for (const room of roomCodes) {
    const payload = buildHouseholdFromRoom(room, grouped[room]);
    const existing = await Household.findOne({ code: room });

    if (existing) {
      await Household.updateOne({ _id: existing._id }, { $set: payload });
      updated += 1;
    } else {
      await Household.create(payload);
      created += 1;
    }
  }

  res.status(200).json({
    message: 'Đã migrate dữ liệu room sang household',
    created,
    updated,
    totalRooms: roomCodes.length,
  });
}
