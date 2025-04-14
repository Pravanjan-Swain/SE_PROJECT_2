import mongoose from "mongoose";

const deliveryDetailSchema = new mongoose.Schema({
    date : {
        type : Date,
        required : true,
    },
    totalDeliveries : {
      type : Number,
      requried : true,
    },
    totalValue : {
        type : Number,
        required : true
    }
});

const deliveryPaymentSchema = new mongoose.Schema({
    deliverer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Deliverer",
        required : true
    },
    paymentPeriod : {
        start : {
            type : Date,
            required : true
        },
        end : {
            type : Date,
            required : true
        }
    },
    deliveryDetails : [deliveryDetailSchema],
    totalDeliveries : {
        type : Number,
        required : true
    },
    commisionRate : {
        type : Number,
        required : true,
        default : 0.25
    },
    commisionAmount : {
        type : Number,
        required : true
    },
    isPaid : {
        type : Boolean,
        default : false
    },
    paymentDate : {
        type : Date
    },
    remarks : {
        type : String
    }
}, {timeStamps : true});

const DeliveryPayment = mongoose.model("DeliveryPayment",deliveryPaymentSchema);

export default DeliveryPayment;