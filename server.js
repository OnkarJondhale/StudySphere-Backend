const express = require('express');
const connectDb = require('./config/database.js');
const connectCloudinary = require('./config/cloudinary.js');
const userRouter = require('./route/User.js');
const profileRouter = require('./route/Profile.js');
const courseRouter = require('./route/Course.js');
const paymentRouter = require('./route/Payment.js');
const { connectMail } = require('./config/nodemailer.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000; 


app.use(cookieParser());
app.use(cors(
    {
        origin: 'http://localhost:5173', 
        credentials: true,
    }
));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "/tmp/"
}));
app.use(express.json());

connectDb();
connectMail();
connectCloudinary();

app.use('/user',userRouter);
app.use('/profile',profileRouter);
app.use('/course',courseRouter);
app.use('/payment',paymentRouter);

app.listen(PORT,()=>{
    console.log("server started successfully at",PORT)
}); 

app.get('/',(req,res)=>{
    res.send("Default Page");
});