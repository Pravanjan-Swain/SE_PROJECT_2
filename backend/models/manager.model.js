import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
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
    }
}, {timeStamps : true})

const Manager = mongoose.model("Manager", managerSchema);

export default Manager;