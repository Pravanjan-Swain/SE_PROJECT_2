import mongoose from "mongoose"

const routeAddressSchema = new mongoose.Schema({
    customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Customer",
        required : true
    },
    sequenceNo : {
        type : Number,
        required : true
    }
});

const deliveryRouteSchema = new mongoose.Schema({
    deliverer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Deliverer",
        required : true
    },
    routeName : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    address : [routeAddressSchema],
    isActive : {
        type : Boolean,
        default : true,
    },
}, {timeStamps : true});

const DeliveryRoute = mongoose.model("DeliveryRoute",deliveryRouteSchema);

export default DeliveryRoute;