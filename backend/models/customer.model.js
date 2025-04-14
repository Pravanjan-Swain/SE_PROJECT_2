import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    name : {
        type : String,
        required : true,
    },
    address : {
        city : String,
        street : String,
    },
    isActive : {
        type : Boolean,
        default : true
    },
    registrationDate : {
        type : Date,
        default : Date.now
    },
    outStandingDues : {
        type : Number,
        default : 0
    },
}, {timestamps : true});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;