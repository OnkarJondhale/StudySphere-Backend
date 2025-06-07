const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: { type: String, required: true },
    paymentId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, default : 'Pending'},
    createdAt: { type: Date, default: Date.now },
    email : {type : String,require : true}
});

module.exports = mongoose.model('Payment', paymentSchema);
