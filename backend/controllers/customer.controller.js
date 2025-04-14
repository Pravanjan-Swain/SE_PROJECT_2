import Customer from "../models/customer.model";
import Publication from "../models/publication.model";
import Subscription from "../models/subscription.model";

const checkSubscription = async(req,res) => {
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

const updateSubscription = async (req,res) => {
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

const addSubscription = async (req,res) => {
    try{
        const {startDate,endDate,frequency,price} = req.body;
        
        const customer = await Customer.findOne({user : req.user.id});

        if(!customer){
            return res.status(404).json({
                success : false,
                message : "Customer not found"
            });
        }

        const 
    }
    catch(err) {
        console.error(err.message);
        res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        })
    }
}

const showPublications = async (req,res) => {
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
const makePayment = async (req,res) => {
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