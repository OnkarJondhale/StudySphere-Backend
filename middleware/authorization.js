const User = require('../model/User.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('dotenv').config();

exports.auth = async (req,res,next) =>{
    try 
    {
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        console.log(req.cookies);
        console.log(token);
        if(!token)
        {
            return res.status(401).json({
                success : false,
                message : "Token is missing"
            })
        }
        
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode;
        next();
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.isStudent = async (req,res,next) =>{
    try 
    {
       const role = req.user.accountType;
       if(role!=='Student')
       {
        return res.status(401).json({
            success : false,
            message : "Protected route for Student"
        })
       }

       next();
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.isInstructor = async (req,res,next) =>{
    try 
    {
       const role = req.user.accountType;
       if(role!=='Instructor')
       {
        return res.status(401).json({
            success : false,
            message : "Protected route for Instructor"
        })
       }
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }

    next();
}

exports.isAdmin = async (req,res,next) =>{
    try 
    {
       const role = req.user.accountType;
       if(role!=='Admin')
       {
        return res.status(401).json({
            success : false,
            message : "Protected route for Admin"
        })
       }
    }
    catch(error)
    {
        console.log(error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }

    next();
}