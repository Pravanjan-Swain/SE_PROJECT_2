import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    pricePerCopy: { 
        type: Number, 
        required: true 
    }
});

const Publication = mongoose.model('Publication', publicationSchema);

export default Publication;
