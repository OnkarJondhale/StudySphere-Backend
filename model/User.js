const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    accountType : {
        type : String,
        enum : ["Admin","Student","Instructor"]
    },
    additionalDetails : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Profile"
    },
    courses : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course"
        }
    ],
    avatar : String,
    token : String,
    resetPassword : Date,
    courseProgress : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Courseprogress"
        }
    ]
})

module.exports = mongoose.model("User",schema);