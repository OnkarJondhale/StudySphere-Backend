const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    courseId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Course"
    },
    userId : 
    {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    completedVideo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subsection"
    },
})

module.exports = mongoose.model("Courseprogress",schema);