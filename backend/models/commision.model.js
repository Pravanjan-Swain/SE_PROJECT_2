import mongoose from "mongoose";

const commissionLogSchema = new mongoose.Schema({
  deliverer: { type: mongoose.Schema.Types.ObjectId, ref: 'Deliverer', required: true },
  month: { type: String, required: true }, // e.g., "2025-04"
  totalValueDelivered: { type: Number, required: true },
  commissionAmount: { type: Number, required: true }
});

const Commision = mongoose.model('Commission', commissionLogSchema);

export default Commision;