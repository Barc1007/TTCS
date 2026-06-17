import Household from '../models/Household.js';
import Resident from '../models/Resident.js';

function buildHouseholdFromRoom(room, residents) {
  const sortedResidents = [...residents].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const headResident = sortedResidents.find((resident) => resident.relation === 'Chủ hộ') || sortedResidents[0] || null;
  const address = sortedResidents.find((resident) => resident.address && resident.address.trim())?.address?.trim() || `Phòng ${room}`;
  const members = sortedResidents.map((resident) => resident._id);

  return {
    code: room,
    apartment: room,
    address,
    headResidentId: headResident?._id || null,
    members,
    memberCount: members.length,
  };
}

export async function syncHouseholdFromResidents(room) {
  const normalizedRoom = (room || '').trim().toUpperCase();
  if (!normalizedRoom) return null;

  const activeResidents = await Resident.find({
    room: normalizedRoom,
    isDeleted: { $ne: true },
  }).sort({ createdAt: 1 });

  const payload = buildHouseholdFromRoom(normalizedRoom, activeResidents);
  const existing = await Household.findOne({ code: normalizedRoom });

  if (activeResidents.length === 0) {
    if (existing) {
      await Household.deleteOne({ _id: existing._id });
    }
    return null;
  }

  if (existing) {
    const existingMembers = (existing.members || []).map((id) => String(id)).sort();
    const payloadMembers = (payload.members || []).map((id) => String(id)).sort();
    const hasChanges =
      existing.apartment !== payload.apartment ||
      existing.address !== payload.address ||
      String(existing.headResidentId || '') !== String(payload.headResidentId || '') ||
      existing.memberCount !== payload.memberCount ||
      existingMembers.length !== payloadMembers.length ||
      existingMembers.some((memberId, index) => memberId !== payloadMembers[index]);

    if (hasChanges) {
      await Household.updateOne({ _id: existing._id }, { $set: payload });
    }
    return payload;
  }

  await Household.create(payload);
  return payload;
}

export async function syncHouseholdsFromResidents(residents = []) {
  const rooms = [...new Set(
    residents
      .map((resident) => (resident.room || '').trim().toUpperCase())
      .filter(Boolean)
  )];

  const results = [];
  for (const room of rooms) {
    const payload = await syncHouseholdFromResidents(room);
    if (payload) results.push(payload);
  }
  return results;
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

  const household = await Household.create({
    code,
    apartment,
    address,
    headResidentId,
    members,
    memberCount: members.length,
  });
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
