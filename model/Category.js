const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name : String,
    description : String,
    course : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Course"
        }
    ]
})

module.exports = mongoose.model("Category",schema);