import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  month: { type: String, required: true }, // e.g., "2025-04"
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  dueDate: { type: Date },
  generatedDate: { type: Date, default: Date.now },
  items: [{
    publication: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' },
    copies: { type: Number },
    amount: { type: Number }
  }]
});

const Bill = mongoose.model("Bill", billSchema);

export default Bill;