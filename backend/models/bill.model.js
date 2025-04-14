import mongoose from "mongoose";

const billDetailSchema = new mongoose.Schema({
    publication : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Publication",
        required : true
    },
    quantity : {
        type : Number,
        required : true,
    },
    unitPrice : {
        type : Number,
        required : true,
    },
    amount : {
      type : Number,
      required : true
    }
})


const billSchema = new mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer",
        required : true, 
    },
    billDate : {
        type : Date,
        required : true,
    },
    dueDate : {
        type : Date,
        required : true,
    },
    billDetails : [billDetailSchema],
    totalAmount : {
        type : Number,
        required : true
    },
    isPaid : {
        type : Boolean,
        default : false,
    },
    billPeriod : {
        start : {
            type : Date,
            required : true,
        },
        end : {
            type : Date,
            required : true
        }
    },
    remainderSent : {
        type : Boolean,
        default : false,
    }
}, {timeStamps : true})

const Bill = mongoose.model("Bill", billSchema);

export default Bill;