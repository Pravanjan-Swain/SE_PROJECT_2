import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    Area : {
        type : String,
        required : true,
    }
})

const Manager = mongoose.model("Manager", managerSchema);

export default Manager;