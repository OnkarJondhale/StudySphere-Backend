const Profile = require('../model/Profile.js');
const User = require('../model/User.js');
const fileUpload = require("../util/cloudinaryUpload.js");
require('dotenv').config();

// done
exports.updateProfile = async (req,res)=>{
    try 
    {
        const {lastName,firstName,dob,gender,about,contactNumber} = req.body;
        const userId = req.user.id;

        console.log(lastName,firstName,dob,gender,about,contactNumber,userId);
        if(!userId || !gender || !about || !lastName || !firstName)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials" 
            }) 
        }

        const profileId = await User.findById({_id : userId},{additionalDetails : 1},{new : true});

        const updateProfile = await Profile.findByIdAndUpdate(profileId.additionalDetails,
            {
                dob : dob,
                gender : gender,
                about : about,
                contactNumber : contactNumber
            }, 
            {new : true}
        )

        const updateUser = await User.findByIdAndUpdate({_id : userId},{lastName : lastName,firstName : firstName},{new : true}).populate("additionalDetails").exec();

        updateUser.password = undefined;

        return res.status(200).json({
            success : true,
            message : "Update profile successfully",
            data : updateUser
        })
    }
    catch(error)
    {
        console.log("Update profile",error.message); 
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.updateImage = async(req,res)=> {
    try 
    {
        const id = req.user.id;
        const file = req.files.file;

        if(!file)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            })
        }
        
        const response = await fileUpload(file,process.env.FOLDER,null,null);

        const updateUser = await User.findByIdAndUpdate({_id : id},{$set : {avatar : response.url}},{new:true});

        const newUser = await User.findById(id).populate("additionalDetails").exec();

        return res.status(200).json({
            success : true,
            message : "Image uploaded successfully",
            data : newUser
        })
    }
    catch(error)
    {
        console.log("Update Image",error.message); 
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.deleteAccount = async (req,res)=>{
    try 
    {
        const {userId} = req.user.id;

        if(!userId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            }) 
        }

        const userExist = await User.findById(userId);   

        if(!userExist)
        {
            return res.status(404).json({
                success : false,
                message : "User does not exist"
            }) 
        }

        const profileId = userExist.additionalDetails;

        const deleteProfile = await Profile.findByIdAndDelete(profileId);
        const deleteAccount = await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success : true,
            message : "Deleted profile successfully",
            data : {
                deleteProfile,
                deleteAccount
            }
        })
    }
    catch(error)
    {
        console.log("Delete account",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.getAllUsers = async (req,res) =>{
    try 
    {
        const userId = req.user.id;

        if(!userId)
        {
            return res.status(404).json({
                success : false,
                message : "User does not exist"
            }) 
        }

        const userDetails = await User.findById(userId).populate("additionalDetails").exec();
        userDetails.password = undefined;

        return res.status(200).json({
            success : true,
            message : "User profile details fetched successfully",
            data : userDetails
        })
    }
    catch(error)
    {
        console.log("GetAllUsers profile",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// 
exports.getEnrolledCourses = async (req,res) =>{
    try 
    {
        const userId = req.user.id;

        if(!userId)
        {
            return res.status(404).json({
                success : false,
                message : "User does not exist"
            }) 
        }

        const userDetails = await User.findById(userId).populate("courses").exec();
        userDetails.password = undefined;

        return res.status(200).json({
            success : true,
            message : "User profile details fetched successfully",
            data : userDetails.courses
        })
    }
    catch(error)
    {
        console.log("GetAllUsers profile",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}