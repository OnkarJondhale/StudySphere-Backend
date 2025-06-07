const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {mailSender} = require('../util/mailSender.js')

const schema = new mongoose.Schema({
    email : String,
    otp : Number,
    createdAt : {
        type : Date,
        default : Date.now,
        expires : 5*60
    }
})

async function sendVerificationEmail(email,otp)
{
    try 
    {
        const response = await mailSender("Here is the OTP for verification",email,`<h1> OTP is ${otp} </h1>`);
        // console.log("Email sent successfully",response);
    }
    catch(error)
    {
        console.log(error.message);
    }
}

schema.pre('save',async function(next){
    const response = await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("Otp",schema);