import Publication from "../models/publication.model.js";
import Manager from "../models/manager.model.js";
import Customer from "../models/customer.model.js";
import Subscription from "../models/subscription.model.js";
import Deliverer from "../models/deliverer.model.js";
import Delivery from "../models/delivery.model.js";
import User from "../models/user.model.js";

const addPublication = async (req,res) => {
    try{
        const {name,language,description,price,type,frequency} = req.body;
        
        const publication = new Publication({
            name,
            language,
            description,
            price,
            type,
            frequency
        })

        await publication.save();

        return res.status(201).json({
            success : true,
            message : "Publication added successfully",
            data : publication
        })
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        });
    }
}

// I need publication id in url
const updatePublication = async (req,res) => {
    try{
        const {name,language,description,price,type,frequency, isActive} = req.body;

        //Find publication by ID
        let publication = await Publication.findById(req.params.id);

        if(!publication){
            return res.status(404).json({
                success : false,
                message : "Publication not found"
            });
        }

        // Update fields
        if(name) publication.name = name;
        if(language) publication.language = language;
        if(description) publication.description = description;
        if(price) publication.price = price;
        if(type) publication.type = type;
        if(frequency) publication.frequency = frequency;
        if(isActive !== undefined) publication.isActive = isActive;
        
        await publication.save();

        return res.status(200).json({
            success : true,
            message : "Publication updated successfully",
            data : publication
        });
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        })
    }
}

const getAllPublications = async (req,res) => {
    try{
        const publications = await Publication.find();

        return res.status(200).json({
            success : true,
            data : publications // array of publication documents
        })
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

const getPublication = async (req,res) => {
    try{
        const publication = await Publication.findById(req.params.id);

        if(!publication){
            return res.status(404).json({
                success : false,
                message : "Publication not found",
            });
        }

        return res.status(200).json({
            success : true,
            data : publication
        })
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server error",
            error : err.message
        });
    }
}

const getAllCustomers = async (req,res) => {
    try{
        const manager = await Manager.findOne({user : req.user.id});

        if(!manager){
            return res.status(404).json({
                success : false,
                message : "Manager not found"
            })
        }

        const managerCity = manager.address.city;

        //get customers in the same city
        const customers = await Customer.find({"address.city" : managerCity}).populate({
            path : "user",
            select : "username contactNo email"
        });

        const result = customers.map(customer => ({
            id : customer._id,
            name : customer.name,
            isActive : customer.isActive,
            outStandingDues : customer.outStandingDues,
            registrationDate : customer.registrationDate,
            user : customer.user
        }))

        return res.status(200).json({
            success : true,
            data : result
        })
    }
    catch(err){
        console.error(err.message);
        return res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        })
    }
};

const getCustomer = async (req,res) => {
    try{
        const customer = await Customer.findById(req.params.id).populate({
            path : "user",
            select : "username email contactNo"
        });

        if(!customer){
            return res.status(404).json({
                success : false,
                message : "Customer not found"
            });
        }

        const subscriptions = await Subscription.find({customer : req.params.id}).populate({
            path : "title",
            select : "title price frequency"
        });

        const payments = await PaymentAddress.find({customer : req.params.id});

        return res.status(200).json({
            success : true,
            data : {
                id : customer._id,
                name : customer.name,
                address : customer.address,
                isActive : Customer.isActive,
                outStandingDues : customer.outStandingDues,
                registrationDate : customer.registrationDate,
                user : customer.user,
                subscriptions,
                payments
            }
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

const getAllDeliverers = async (req,res) => {
    try{

        const manager = await Manager.findOne({user : req.user.id});

        if(!manager){
            return res.status(404).json({
                success : false,
                message : "Manager not found"
            })
        }

        const managerCity = manager.address.city;

        //Finding deliverers from the same city
        const deliverers = await Deliverer.find({"address.city" : managerCity}).populate({
            path : "user",
            select : "username email contactNo"
        });

        const result = deliverers.map(deliverer => ({
            id : deliverer._id,
            name : deliverer.name,
            address : deliverer.address,
            commissionRate : deliverer.commissionRate,
            user : deliverer.user
        }));

        return res.status(200).json({
            success : true,
            data : result
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


// TODO getDeliverer and all its deliveries, and commision paid to it
const getDeliverer = async (req,res) => {
    try{
        const deliverer = await Deliverer.findById(req.params.id).populate({
            path : "user",
            select : "username email contactNo"
        });

        if(!deliverer) {
            return res.status(404).json({
                success : false,
                message : "Deliverer not found"
            })
        }

        
    }
    catch(err){
        
    }
}

// Deactivate deliverer account
const deactivateDeliverer = async (req,res) => {
    try{
        const deliverer = await Deliverer.findById(req.params.id);

        if(!deliverer){
            return res.status(404).json({
                success : false,
                message : "Deliverer not found"
            });
        }

        const user = await User.findById(deliverer.user);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Associated user not found"
            })
        }

        user.isActive = false;
        deliverer.isActive = false;

        await user.save();
        await deliverer.save();

        return res.status(200).json({
            success : true,
            message : "Deliverer account deactivated successfully"
        })
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


// // Deactivate customer account
const deactivateCustomer = async (req,res) => {
    try{
        const customer = await Customer.findById(req.params.id);
        if(!customer){
            return res.status(404).json({
                success : false,
                message : "Customer not found"
            });
        }

        const user = await User.findById(customer.user);
        if(!user){
            return res.status(404).json({
                success : false,
                message : "Associated user not found"
            });
        }

        user.isActive = false;
        customer.isActive = false;

        user.save();
        customer.save();

        return res.status(500).json({
            success : true,
            message : "Customer account deactived successfully",
        })


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