const User = require('../model/User.js');
const Course = require('../model/Course.js');
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');
const Payment = require('../model/Payment.js')

// card details : 5267 3181 8797 5449

// Create Razorpay Order 
exports.createOrder = async (req, res) => {

    const payment_capture = 1;
    const amount = req.body.amount;
    const currency = 'INR';

    const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture,
    };

    console.log(options);
    try {
        const response = await razorpay.orders.create(options);
        
        console.log("create order",response);
 
        res.status(200).json({ 
            orderId: response.id,
            currency: response.currency,
            amount: response.amount,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send({ error: 'Failed to create Razorpay order' });
    }
};

exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,amount,email,courseId,userId} = req.body;

    console.log("verifying payment",razorpay_order_id,razorpay_payment_id,razorpay_signature,amount,courseId,userId)
    try {
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRETE)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).send({ error: 'Invalid payment signature' });
        }

        const payment = await Payment.create({orderId : razorpay_order_id,paymentId : razorpay_payment_id,amount : amount,email : email});
        const updatePayment = await Payment.findByIdAndUpdate(payment._id,{
            status : 'completed'
        })

        const courseUpdated = await Course.findByIdAndUpdate(courseId,{
            $push : {
                studentEnrolled : userId
            }
        },{new : true})

        const userUpdated = await User.findByIdAndUpdate(userId,{
            $push : {
                courses : courseId
            }
        },{new : true})


        res.status(200).json({
            success: true,
            message: 'Payment verified and updated successfully',
            payment,
            courseUpdated,
            userUpdated
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).send({ error: 'Payment verification failed' });
    }
};
