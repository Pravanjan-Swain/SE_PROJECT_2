import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  publication: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication', required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date }, // optional: null if still active
  isActive: { type: Boolean, default: true },
  pausePeriods: [{
    from: { type: Date },
    to: { type: Date }
  }]
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
