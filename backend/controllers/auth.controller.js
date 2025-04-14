import User from "../models/user.model.js";
import Manager from "../models/manager.model.js";
import Deliverer from "../models/deliverer.model.js";
import Customer from "../models/customer.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const login = async (req,res) => {
    try{
        const {username,password} = req.body;
        let user = await User.findOne({
            $or : [
                {username},
                {email : username}  // Allowing to login with email as well
            ]
        });

        // Checking if user exists
        if(!user){
            return res.status(400).json({
                success : false,
                message : "Invalid credentials"
            });
        }

        // Checking if user is active
        if(!user.isActive){
            return res.status(401).json({
                success : false,
                message : "Account is disabled. Please contact adminstrator."
            });
        }

        // Comparing the password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                success : false,
                message : "Invalid Credentials"
            });
        }

        // Create JWT paylod
        const payload = {
            user : {
                id : user._id,
                role : user.role,
            }
        };

        let userData = {};

        if(user.role === "manager"){
            const manager = await Manager.findOne({user : user._id});
            userData = manager ? {
                name : manager.name,
                address : manager.address
            } : {};
        }
        else if(user.role === "deliverer"){
            const deliverer = await Deliverer.findOne({user : user._id});
            userData = deliverer ? {
                name : deliverer.name,
                address : deliverer.address
            } : {};
        }
        else if(user.role === "customer"){
            const customer = await Customer.findOne({user : user._id});
            userData = customer ? {
                name : customer.name,
                address : customer.address
            } : {}
        }

        // Sign Token
        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRATION},(err,token) => {
            if(err) throw err;
            res.cookie("jwt",token);    // Saved the jwt in req,res cycle
            res.json({
                success : true,
                user : {
                    id : user._id,
                    username : user.username,
                    email : user.email,
                    role : user.role,
                    ...userData
                }
            })
        });
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({
            success : false,
            message : "Server error",
            err : err.message
        });
    }
};


const register = async (req,res) => {
    try{
        const {username,password,role,email,contactNo,name,address} = req.body;
        let user = await User.findOne({$or : [{email},{username}]});
        if(user){
            return res.status(400).json({
                success : false,
                message : "Email or Username is already registered"
            });
        }

        // Create user account
        user = new User({
            username,
            password,
            email,
            role,
            contactNo,
        });

        //HashPassword
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await user.save();

        let userData = {};

        if(role === "manager"){
            let manager = await Manager.findOne({"address.city" : address.city});
            if(manager && manager.isActive){
                await User.deleteOne({ _id: user._id });
                return res.status(400).json({
                    success : false,
                    message : "Manager already exists in this location"
                })
            }
            
            manager = new Manager({
                user : user._id,
                name,
                address
            })

            await manager.save();
            userData = {
                name,
                address
            }
        }
        else if(role === "customer"){
            let customer =  new Customer({
                user : user._id,
                name,
                address
            })

            await customer.save();
            userData = {
                name,
                address
            }
        }
        else if(role === "deliverer"){
            let deliverer = new Deliverer({
                user : user._id,
                name,
                address
            })

            await deliverer.save();
            userData = {
                name : deliverer.name,
                address
            }
        }

        const payload = {
            user : {
                id : user._id,
                role : user.role
            }
        }

        // Sign Jwt Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn : process.env.JWT_EXPIRATION},
            (err,token) => {
                if (err) throw err;
                res.cookie("jwt",token);
                res.status(201).json({
                    success : true,
                    message : `${role} registered successfully`,
                    user : {
                        id : user._id,
                        email : user.email,
                        role : user.role,
                        ...userData
                    }
                });
            }
        );
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        })
    }
}

const logout = async (req,res) => {
    try{
        res.clearCookie("jwt");
        res.status(200).json({message : "Logged out successfully"});
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        });
    }
}

// TODO checkAuth
const checkAuth = async (req,res) => {
    try{
        return res.status(200).json(req.user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({
            success : false,
            message : "Server Error",
            error : err.message
        })
    }
}
