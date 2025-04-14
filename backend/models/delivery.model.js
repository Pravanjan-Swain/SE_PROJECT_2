import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
    subscription : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subscription",
        required : true
    },
    deliverer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Deliverer', 
        required : true,
    },
    deliveryDate: { 
        type: Date, 
        required : true ,
        default : Date.now
    },
    isDelivered : {
        type : Boolean,
        default : false
    },
    deliveryStatus : {
        type : String,
        enum : ['pending', 'delivered', 'failed', 'cancelled'],
        default : 'pending',
    },
    failureReason : {
        type : String,
    }
}, {timeStamps : true});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;
