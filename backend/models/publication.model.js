import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
    },
    language : {
        type : String,
        required : true
    },
    description : {
        type : String,
        default : ""
    },
    price : {
        type : Number,
        default : 1
    },
    type : {
        type : String,
        enum : ['newspaper', 'magazine'],
        required : true
    },
    frequency : {
        type : String,
        enum : ['daily', 'weekly', 'monthly', 'quaterly'],
        default : "daily"
    },
    isActive : {
        type : Boolean,
        default : true
    }
}, {timeStamps : true});

const Publication = mongoose.model('Publication', publicationSchema);

export default Publication;
