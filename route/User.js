const express = require('express');
const userRouter = express.Router();

const {signup,login,createOtp,resetpassword,resetpasswordtoken,changepassword} = require('../controller/authentication.js');
const {auth,isAdmin,isStudent} = require('../middleware/authorization.js');
const {contactUs} = require('../controller/contact.js');

userRouter.post('/signup',signup);
userRouter.post('/createotp',createOtp);
userRouter.post('/login',login);
userRouter.post('/changepassword',changepassword);
userRouter.post('/resetpasswordtoken',resetpasswordtoken);
userRouter.post('/resetpassword',resetpassword);
userRouter.post('/contactus',contactUs);
userRouter.post('/auth',auth);

module.exports = userRouter;