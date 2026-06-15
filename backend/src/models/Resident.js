import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    by: { type: String, default: 'Hệ thống' },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

const temporarySchema = new mongoose.Schema(
  {
    address: { type: String, default: '' },
    destination: { type: String, default: '' },
    start: { type: String, default: '' },
    end: { type: String, default: '' },
    reason: { type: String, default: '' },
    phone: { type: String, default: '' },
  },
  { _id: false }
);

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cccd: { type: String, required: true, unique: true },
    dob: { type: String, required: true },
    gender: { type: String, required: true },
    room: { type: String, required: true },
    status: { type: String, enum: ['Thường trú', 'Tạm trú', 'Tạm vắng', 'Không ở'], default: 'Thường trú' },
    address: { type: String, default: '' },
    ethnic: { type: String, default: 'Kinh' },
    religion: { type: String, default: 'Không' },
    job: { type: String, default: '' },
    email: { type: String, default: '' },
    relation: { type: String, default: 'Chủ hộ' },
    regdate: { type: String, required: true },
    tamTru: { type: temporarySchema, default: null },
    tamVang: { type: temporarySchema, default: null },
    history: { type: [historySchema], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Resident', residentSchema);
