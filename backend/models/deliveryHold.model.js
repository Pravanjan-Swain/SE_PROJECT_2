import mongoose from "mongoose";

const deliveryHoldSchema = new mongoose.Schema({
    subscription : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subcription",
        required : true
    },
    startDate : {
        type : Date,
        required : true,
    },
    endDate : {
        type : Date,
        required : true,
    },
    reason : {
        type : String,
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, {timeStamps : true});

const DeliveryHold = mongoose.model("DeliveryHold", deliveryHoldSchema);

export default DeliveryHold;