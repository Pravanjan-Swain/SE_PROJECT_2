import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    customer : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    bill : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Bill",
    },
    amount : {
        type : Number,
        required : true,
    },
    paymentDate : {
        type : String,
        required : true,
        default : Date.now,
    },
    paymentMode : {
        type : String,
        enum : ["cash"," cheque","online"],
        required : true,
    },
    referenceNo : {
        type : String // cheque number or transactionId
    },
    isCleared : {
        type : Boolean,
        default : true
    },
    remarks : {
        type : String,
    },
},{timeStamps : true});

const Payment = mongoose.model("Payment",paymentSchema);

export default Payment;