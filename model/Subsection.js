const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title : String,
    timeDuration : String,
    description : String,
    url : String
})

module.exports = mongoose.model("Subsection",schema);