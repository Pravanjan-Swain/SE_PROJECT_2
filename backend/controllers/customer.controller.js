import Customer from '../models/customer.model.js'
import Publication from "../models/publication.model.js";
import Subscription from "../models/subscription.model.js";

export const checkSubscription = async(req,res) => {
    try{
        const customer = await Customer.findOne({user : req.user.id});

        if(!customer){
            return res.status(404).json({
                success : false,
                message : "Customer not found"
            })
        }

        const subscriptions = await Subscription.find({customer : customer._id}).populate("publication");

        return res.status(200).json({
            success : true,
            data : subscriptions
        });
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        })
    }
}

export const updateSubscription = async (req,res) => {
    try{
        const customer = await Customer.findOne({user : req.user.id});

        if(!customer){
            return res.status(404).json({success : false, 
                message : "Customer not found"
            });
        }

        const updates = req.body;
        const subscription = await Subscription.findOneAndUpdate(
            {_id : req.params.id, customer : customer._id},
            updates,
            {new:true}
        );

        return res.status(200).json({
            success : true,
            message : "Subscription updated",
            subscription
        });


    }
    catch(err){ 
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        })
    }
}

export const addSubscription = async (req,res) => {
    try {
        const {startDate, endDate, frequency, price, publicationId} = req.body;
        
        const customer = await Customer.findOne({user: req.user.id});

        if(!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const publication = await Publication.findById(publicationId);
        
        if(!publication) {
            return res.status(404).json({
                success: false,
                message: "Publication not found"
            });
        }

        const newSubscription = new Subscription({
            customer: customer._id,
            publication: publicationId,
            startDate,
            endDate,
            frequency,
            price
        });

        await newSubscription.save();

        return res.status(201).json({
            success: true,
            message: "Subscription added successfully",
            subscription: newSubscription
        });
    }
    catch(err) {
        console.error(err.message);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
}

export const showPublications = async (req,res) => {
    try{
        const publications = await Publication.find();

        return res.status(200).json({
            success : true,
            message : "Publications fetched successfully",
            publications
        });
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        })
    }
}


// make Payment // TODO
export const makePayment = async (req,res) => {
    try{

    }
    catch(err) {
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        })
    }
}


// Check Bills TODO