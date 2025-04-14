import mongoose, { Schema } from "mongoose";

const areaSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    managerId : {
        type : Schema.Types.ObjectId, 
        ref : "Manager",
    },
    delivererId : {
        type : Schema.Types.ObjectId, 
    },
    customerId : [{
        type : String,
    }]
});

const Area = mongoose.model("Area", areaSchema);

export default Area;