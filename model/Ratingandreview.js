const mongoose = require('mongoose');

const schema = new mongoose.Schema({
       user : 
       {
           type : mongoose.Schema.Types.ObjectId,
           ref : "User"
       },
       course : 
       {
            type : mongoose.Schema.Types.ObjectId,
           ref : "Course"
       },
       rating : Number,
       review : String
})

module.exports = mongoose.model("Ratingandreview",schema);