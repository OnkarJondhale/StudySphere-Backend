const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    sectionName : String,
    subSection : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Subsection"
        }
    ]
},{timestamps : true});

module.exports = mongoose.model("Section",schema);