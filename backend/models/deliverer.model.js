import mongoose from "mongoose";

const delivererSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    name : {
        type : String,
        required : true
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
    commissionRate : {
        type : Number,
        default : 0.25
    }
}, {timeStamps : true});

const Deliverer = mongoose.model("Deliverer", delivererSchema);

export default Deliverer;