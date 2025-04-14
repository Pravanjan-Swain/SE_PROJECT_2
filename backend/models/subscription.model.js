import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    customer: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Customer', 
      required: true
    },
    publication: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Publication', 
      required: true
    },
    startDate: { 
      type: Date, 
      required : true
    },
    endDate: { 
      type: Date // optional: null if still active
    }, 
    isActive: { 
      type: Boolean, 
      default: true
    },
    quantity : {
      type : Boolean,
      default : true,
    }
}, {timeStamps : true});

subscriptionSchema.index({customer:1, publication:1}, {unique:true});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
