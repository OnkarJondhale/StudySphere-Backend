const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    dob : String,
    gender : String,
    about : String,
    contactNumber : Number
})

module.exports = mongoose.model("Profile",schema);