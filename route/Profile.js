const express = require('express');
const profileRouter = express.Router();

const {updateProfile,deleteAccount,getAllUsers,updateImage,getEnrolledCourses} = require('../controller/profile.js')
const {auth} = require('../middleware/authorization.js')

profileRouter.post('/getuserdetail',auth,getAllUsers);
profileRouter.put('/updateprofile',auth,updateProfile);
profileRouter.put('/updateimage',auth,updateImage);
profileRouter.get('/getenrolledcourses',auth,getEnrolledCourses);

module.exports = profileRouter;