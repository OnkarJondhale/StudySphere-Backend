const mongoose = require('mongoose');
const Ratingandreview = require('../model/Ratingandreview.js');
const Course = require('../model/Course.js');

exports.createRating = async (req,res)=>{
    try 
    {
        const {userId} = req.user.id;
        const {courseId,rating,review} = req.body;

        if(!courseId || !userId || !rating || !review)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            }) 
        }

        const courseEnrolled = await Course.find({__id : courseId},{studentEnrolled : 1});

        if(!courseEnrolled)
        {
            return res.status(404).json({
                success : false,
                message : "Course not found"
            })
        }

        if(!courseEnrolled.includes(userId))
        {
            return res.status(404).json({
                success : false,
                message : "User not enrolled in the course"
            })
        }

        const alreadyReviewed = await Ratingandreview.find({user:userId,course:courseId});

        if(alreadyReviewed)
        {
            return res.status(400).json({
                success : false,
                message : "Already reviewed the course"
            }) 
        }

        const reviewAndRating = await Ratingandreview.create({userId,courseId,rating,review});

        const updateCourse = await Course.findByIdAndUpdate(
            {__id : courseId},
            {
                $push : 
                {
                    ratingAndReview : reviewAndRating.__id
                }
            },
            {new : true}
        )

        return res.status(200).json({
            success : true,
            message : "Review and rating added successfully",
            data : {
                reviewAndRating,
                updateCourse
            }
        })
    }
    catch(error)
    {
        console.log("Create rating",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
} 

exports.getAverageRating = async (req,res)=>{
    try 
    {
        const {courseId} = req.body;
        
        if(!courseId)
        {
            return res.status(404).json({
                success : false,
                message : "Course not found"
            })
        }

        const response = await Ratingandreview.aggregate([
            {
                $match : 
                {
                    course : new mongoose.Schema.Types.ObjectId(courseId)
                },
                $group : 
                {
                    __id : null,
                    averageRating : {$avg : "$rating"}
                }
            }
        ])

        if(response.size()==0)
        {
            return res.status(200).json({
                success : true,
                message : "Average rating is 0, No rating found till now",
                data : 0
            })
        }

        return res.status(200).json({
            success : true,
            message : "Average rating fetched successfully",
            data : response[0].averageRating
        })
    }
    catch(error)
    {
        console.log("getaveragerating",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


exports.getAllReviewAndRating = async (req,res)=>{
    try 
    {
        const response = await Ratingandreview.find({}).sort({rating : -1})
                                    .populate({
                                        path : "User",
                                        select : "firstName lastName avatar email"
                                    })
                                    .populate({
                                        path : "Course",
                                        select : "courseName"
                                    })
                                    .exec();

        if(!response)
        {
            return res.status(404).json({
                success : false,
                message : "Reviews and rating not found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Reviews and ratings fetched successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("getallreviewandrating",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}