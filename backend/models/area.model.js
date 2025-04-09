import mongoose, { Schema } from "mongoose";

const areaSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    managersId : [{
        type : Schema.Types.ObjectId, 
        ref : "Manager",
    }],
    deliverersId : [{
        type : Schema.Types.ObjectId, 
    }],
    customersId : [{
        type : String,
    }]
});

const Area = mongoose.model("Area", areaSchema);

export default Area;