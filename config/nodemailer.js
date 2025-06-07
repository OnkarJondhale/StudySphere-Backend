const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const connectMail = ()=>
{
    transporter.verify(function (error, success) { 
        if (error)
        {
            console.log("connectMail",error.message); 
        } 
        else 
        {
            console.log("Server is ready to take our messages");
        }
    });
}

module.exports = { transporter , connectMail } ; 