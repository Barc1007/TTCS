import mongoose from 'mongoose';

const householdSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    apartment: { type: String, required: true },
    address: { type: String, required: true },
    headResidentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', default: null },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resident' }],
  },
  { timestamps: true }
);

export default mongoose.model('Household', householdSchema);
