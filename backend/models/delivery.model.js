import mongoose from "mongoose";

const deliveryLogSchema = new mongoose.Schema({
  deliverer: { type: mongoose.Schema.Types.ObjectId, ref: 'Deliverer', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  publications: [{
    publication: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' },
    copies: { type: Number, default: 1 }
  }]
});

const Delivery = mongoose.model('Delivery', deliveryLogSchema);

export default Delivery;
