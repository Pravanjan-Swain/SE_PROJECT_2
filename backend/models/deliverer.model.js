import mongoose from "mongoose";

const delivererSchema = new mongoose.Schema({
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
    },
    bankDetails : {
        type : String,
        required : true,
    }
});

const Deliverer = mongoose.model("Deliverer", delivererSchema);

export default Deliverer;