import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import Resident from '../models/Resident.js';
import Household from '../models/Household.js';
import User from '../models/User.js';

const rooms = Array.from({ length: 15 }, (_, index) => String(101 + index));

const seedResidents = [
  { cccd: '012345678901', name: 'Nguyễn Văn An', dob: '1990-03-12', gender: 'Nam' },
  { cccd: '012345678902', name: 'Trần Thị Bình', dob: '1992-07-24', gender: 'Nữ' },
  { cccd: '012345678903', name: 'Lê Hoàng Cường', dob: '1988-11-05', gender: 'Nam' },
  { cccd: '012345678904', name: 'Phạm Thị Duyên', dob: '1995-01-18', gender: 'Nữ' },
  { cccd: '012345678905', name: 'Võ Minh Đức', dob: '1986-09-30', gender: 'Nam' },
  { cccd: '012345678906', name: 'Bùi Thu Hà', dob: '1993-04-14', gender: 'Nữ' },
  { cccd: '012345678907', name: 'Đặng Quốc Huy', dob: '1991-06-21', gender: 'Nam' },
  { cccd: '012345678908', name: 'Ngô Mỹ Linh', dob: '1996-12-09', gender: 'Nữ' },
  { cccd: '012345678909', name: 'Huỳnh Gia Minh', dob: '1989-08-03', gender: 'Nam' },
  { cccd: '012345678910', name: 'Dương Khánh Ngọc', dob: '1994-10-27', gender: 'Nữ' },
  { cccd: '012345678911', name: 'Lý Văn Phúc', dob: '1987-02-11', gender: 'Nam' },
  { cccd: '012345678912', name: 'Trịnh Thanh Quỳnh', dob: '1997-05-19', gender: 'Nữ' },
  { cccd: '012345678913', name: 'Đỗ Văn Sơn', dob: '1990-09-08', gender: 'Nam' },
  { cccd: '012345678914', name: 'Hoàng Thị Trang', dob: '1993-03-26', gender: 'Nữ' },
  { cccd: '012345678915', name: 'Phan Anh Tuấn', dob: '1985-12-16', gender: 'Nam' },
  { cccd: '012345678916', name: 'Nguyễn Thị Uyên', dob: '1998-01-07', gender: 'Nữ' },
  { cccd: '012345678917', name: 'Tạ Quang Vinh', dob: '1992-06-30', gender: 'Nam' },
  { cccd: '012345678918', name: 'Lâm Bảo Yến', dob: '1995-11-22', gender: 'Nữ' },
  { cccd: '012345678919', name: 'Mai Đức Anh', dob: '1988-04-05', gender: 'Nam' },
  { cccd: '012345678920', name: 'Cao Thị Xuân', dob: '1996-08-13', gender: 'Nữ' },
];

const roomAssignments = {
  '101': [0, 1],
  '102': [2],
  '103': [3],
  '104': [4, 5],
  '105': [6],
  '106': [7],
  '107': [8, 9],
  '108': [10],
  '109': [11],
  '110': [12, 13],
  '111': [14],
  '112': [15],
  '113': [16, 17],
  '114': [18],
  '115': [19],
};

function buildAddress(room) {
  const floor = Math.floor((Number(room) - 1) / 10) + 1;
  return `Tầng ${floor}, phòng ${room}, Chung cư ResidentIQ`;
}

async function run() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is required');
  }

  await connectDB(env.mongoUri);

  await Promise.all([
    Resident.deleteMany({}),
    Household.deleteMany({}),
    User.deleteMany({ role: 'resident' }),
  ]);

  const createdResidents = [];
  const createdUsers = [];

  for (const room of rooms) {
    const indexes = roomAssignments[room] || [];
    const residentsInRoom = [];

    for (let i = 0; i < indexes.length; i += 1) {
      const person = seedResidents[indexes[i]];
      const isHead = i === 0;
      const resident = await Resident.create({
        name: person.name,
        cccd: person.cccd,
        dob: person.dob,
        gender: person.gender,
        room,
        status: 'Thường trú',
        address: buildAddress(room),
        ethnic: 'Kinh',
        religion: 'Không',
        job: isHead ? 'Kinh doanh tự do' : 'Nhân viên văn phòng',
        email: `${person.cccd}@resident.local`,
        relation: isHead ? 'Chủ hộ' : 'Thành viên',
        regdate: '2026-06-18',
        tamTru: null,
        tamVang: null,
        history: [{ action: 'Được thêm bởi cán bộ quản lý', by: 'Cán bộ quản lý', at: new Date() }],
        isDeleted: false,
        deletedAt: null,
      });

      const defaultPassword = person.cccd.slice(-8);
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      const user = await User.create({
        name: person.name,
        username: person.cccd,
        email: `${person.cccd}@resident.local`,
        passwordHash,
        role: 'resident',
        residentId: resident._id,
        mustChangePassword: true,
        isDeleted: false,
      });

      residentsInRoom.push(resident);
      createdResidents.push(resident);
      createdUsers.push(user);
    }

    const headResident = residentsInRoom.find((resident) => resident.relation === 'Chủ hộ') || residentsInRoom[0] || null;
    await Household.create({
      code: room,
      apartment: room,
      address: buildAddress(room),
      headResidentId: headResident?._id || null,
      members: residentsInRoom.map((resident) => resident._id),
    });
  }

  console.log(`Seed completed: ${createdResidents.length} residents, ${createdUsers.length} resident users, ${rooms.length} households.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
