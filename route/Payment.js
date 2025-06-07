const express = require('express');
const paymentRouter = express.Router();

const {createOrder,verifyPayment} = require('../controller/payment');

paymentRouter.put('/createorder',createOrder)
paymentRouter.post('/verifypayment',verifyPayment)


module.exports = paymentRouter;