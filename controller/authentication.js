const mogoose = require('mongoose');
const Otp = require('../model/Otp.js');
const User = require('../model/User.js');
const {mailSender} = require('../util/mailSender.js');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const Profile = require('../model/Profile.js');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// done
exports.signup = async (req,res) =>{ 
    try 
    {
        const {email,firstName,lastName,password,confirmPassword,otp,accountType,contactNumber} = req.body;
        
        if(!email || !firstName || !lastName || !password || !confirmPassword || !otp || !accountType)
        {
            return res.status(403).json({
                success : false,
                message : "Input can not be empty"
            })
        }

        if(password!==confirmPassword)
        {
            return res.status(400).json({
                success : false,
                message : "Password and confirm password do not match"
            })
        }

        const userExist = await User.find({email : email});  

        if(userExist.length>0)
        {
            return res.status(401).json({
                success : false,
                message : "User already exist"
            }) 
        }

        // Get recent otp out of multiple otp
        const userOtp = await Otp.find({email : email},{otp : 1,_id : 0}).sort({createdAt : -1}).limit(1);

        if(userOtp.length==0)
        {
            return res.status(400).json({
                success : false,
                message : "Otp expired"
            })
        }

        if(otp!=userOtp[0].otp)
        {
            return res.status(401).json({
                success : false,
                message : "Otp do not matched"
            })
        }

        const hashedPassword =  await bcrypt.hash(password,10);

        const newProfile = await Profile.create({email,contactNumber});
        const newUser = await User.create({firstName,lastName,email,password : hashedPassword,accountType,additionalDetails : newProfile._id,
            avatar : `http://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`
        });

        console.log(newUser,newUser.additionalDetails);
        res.status(200).json({
            success : true,
            data : newUser,
            message : "User created successfully"
        })
    }
    catch(error)
    {
        console.log("signup",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.login = async (req,res) =>{
    try 
    {
        const {email,password} = req.body;

        if(!email || !password)
        {
            return res.status(403).json({
                success : false,
                message : "Input can not be empty"
            })
        }

        const userExist = await User.findOne({email : email}).populate("additionalDetails");

        if(!userExist)
        {
            return res.status(404).json({
                success : false,
                message : "User does not exist"
            })
        }
        
        if(await bcrypt.compare(password,userExist.password))  
        {
            console.log(password,userExist.password);
            const payload = {
                email : userExist.email,
                id : userExist._id,
                accountType : userExist.accountType
            };
            userExist.password = undefined;

            const jwtToken = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "3600h"
            });
            
            userExist.token = jwtToken;
            userExist.password = undefined;
            
            const options = {
                expires : new Date(Date.now() + 5*60*60*1000),
                httpOnly : true
            }

            res.cookie("jwt-token",jwtToken,options).status(200).json({
                success : true,
                data : userExist,
                token : jwtToken,
                message : "User Login successfully"
            });
        }
        else
        {
            return res.status(401).json({
                success : false,
                message : "Incorrect password"
            });
        }

    }
    catch(error)
    {
        console.log("login",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.createOtp = async (req,res) =>{
    try 
    {
        const email = req.body.email;
        if(!email)
        {
            return res.status(403).json({
                success : false,
                message : "Email can not be empty"
            })
        }

        const user = await User.findOne({email : email});

        if(user)
        {
            return res.status(401).json({
                success : false,
                message : "User already exist"
            })
        }

        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets : false ,specialChars: false });
        let result = await Otp.findOne({otp : otp});

        while(result) 
        {
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets : false ,specialChars: false });
            result = await Otp.findOne({otp : otp});
        }

        const response = await Otp.create({email,otp}); 

        res.status(200).json({
            success : true,
            message : "Otp send successfully",
            data : otp
        })
    }
    catch(error)
    {
        console.log("createOtp",error.message);
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.changepassword = async (req,res) =>{
    try 
    {
        const {id,oldPassword,newPassword,newConfirmPassword} = req.body;
        
        console.log(id,oldPassword,newPassword,newConfirmPassword);

        if(!id || !oldPassword || !newPassword || !newConfirmPassword)
        {
            return res.status(403).json({
            success : false,
            message : "Input can not be empty"
            })
        }

        if(newPassword!==newConfirmPassword)
        {
            return res.status(403).json({
                success : false,
                message : "Password doesn't matched"
                })
        }

       
        const userExist = await User.findOne({_id : id});

        if(await bcrypt.compare(oldPassword, userExist.password))  
        {
            const hashedPassword = await bcrypt.hash(newPassword,10);
            const updatedUser = await User.updateOne({__id : id},{$set : {password : hashedPassword}},{new : true});

            const response = await mailSender("Password changed successfully",userExist.email,"<h1> Your password has been changed successfully </h1>")

            return res.status(200).json({
                success : true,
                message : "Password updated successfully"
            })
        }
        else
        {
            return res.status(401).json({
                success : false,
                message : "Incorrect password"
            });
        }
    }
    catch(error)
    {
        console.log("change password",error.message);
    }
}

// done
exports.resetpasswordtoken = async (req,res) =>{
    try 
    {   
        const email = req.body.email;

        if(!email)
        {
            return res.status(401).json({
                success : false,
                message : "Input can not be empty"
            })
        }

        const userExist = await User.findOne({email : email});

        if(!userExist)
        {
            return res.status(403).json({
                success : false,
                message : "User does not exist"
            })
        }

        const token = crypto.randomUUID();

        const updatedUser = await User.findOneAndUpdate({email : email},{token : token , resetPassword : Date.now() + 5*60*60*1000},{new : true});

        const URL = `http://localhost:5173/update-password/${token}`;

        const response = await mailSender("Password reset link",email,`<h1> Password reset Link <a> ${URL} </a> </h1>`);

        res.status(200).json({
            success : true,
            message : "Password reset link sent successfully",
            data : URL
        })
    }
    catch(error)
    {
        console.log("resetpasswordtoken",error.message);
    }
}

// done
exports.resetpassword = async (req,res)=>{
    try 
    {
        const {token,password,confirmPassword} = req.body;
        console.log(token,password,confirmPassword)
        if(!token)
        {
            return res.status(401).json({
                success : false,
                message : "Invalid token"
            });
        }

        const userExist = await User.findOne({token : token});

        if(!userExist || userExist.resetPassword<Date.now())
        {
            return res.status(401).json({
                success : false,
                message : "Invalid token"
            })
        }

        if(password!==confirmPassword)
        {
            return res.status(403).json({
                success : false,
                message : "Password does not match"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const updatedUser = await User.findOneAndUpdate( { token: token }, { $set: { password: hashedPassword } }, { new: true } );
        console.log(updatedUser);
        res.status(200).json({
            success : true,
            message : "Password reset successfully"
        })
    }
    catch(error)
    {
        console.log("resetpassword",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}