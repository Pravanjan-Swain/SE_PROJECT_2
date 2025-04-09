import express, { Router } from "express";
import Area from "../../models/area.model";

const router = Router();

const register = async () => {
    let {name, username, password, email, area} = req.body;

    let isAreaPresent = await Area.find({name : area});

    let hashedPassword = createHashPassword(password); // TODO 

    let newUser = new User({
        name, username, password : hashedPassword, email
    })

    if(!isAreaPresent){
        let newArea = new Area({name : area});
        newUser.area = newArea._id;
        newArea.managersId.push(newUser._id);
        newArea.save();
    }

    newUser.save();
} 

const login = async () => {
    let {username, password} = req.body;

    let isPresent = await Manager.find({username});

    if(!isPresent){
        res.status().json({message : "User does not exist"});
    }

    let isCorrectPassword = bcrypt.compare(password, isPresent.password);

    if(isCorrectPassword){
        
    }
}