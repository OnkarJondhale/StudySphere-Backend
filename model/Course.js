const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    courseName : String,
    courseDescription : String,
    instructor : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    whatYouwillLearn : String,
    courseContent : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Section"
        }
    ],
    ratingAndReview : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Ratingandreview"
        }
    ],
    price : Number,
    url : String,
    tags : [
        {
            type : String,
        }
    ],
    category : 
    { 
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category"
    },
    duration :
    {
        type : String
    },
    studentEnrolled : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],
    instructions :
    {
        type : [String],
    },
    status :
    {
        type : String,
        enum : ["Draft","Publish"]
    }
})

module.exports = mongoose.model("Course",schema);