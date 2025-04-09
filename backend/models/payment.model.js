import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  bill: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
  date: { type: Date, default: Date.now },
  method: { type: String, enum: ['cash', 'cheque'], required: true },
  chequeNumber: { type: String }, // if method is cheque
  amountPaid: { type: Number, required: true },
  receiptNumber: { type: String, unique: true }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;