const Course = require('../model/Course.js');
const User = require('../model/User.js');
const Category = require('../model/Category.js');
const fileUpload = require('../util/cloudinaryUpload.js');
require('dotenv').config();

// done
exports.createCourse = async (req,res)=>{
    try 
    {
        const {courseName,courseDescription,whatYouwillLearn,price,category,tags,instructions} = req.body;
        const thumbnail = req.files.thumbnail;
        
        console.log(courseName,courseDescription,whatYouwillLearn,price,category,tags,instructions);
        if(!courseName || !courseDescription || !whatYouwillLearn || !price || !tags || !thumbnail || !instructions)
        {
            return res.status(400).json({
                success : false,
                message : "Missing fields"
            });
        }

        const userId = req.user.id;
        const userExist = await User.findById(userId); 

        if(!userExist)
        {
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }
        
        const name = category;
        const categoryExist = await Category.findOne({ name: name });
        
        if(!categoryExist)
        {
            return res.status(404).json({
                success : false,
                message : "Category not found"
            })
        }

        const response = await fileUpload(thumbnail,process.env.FOLDER,null,null);

        const newCourse = await Course.create({
            courseName : courseName,
            courseDescription : courseDescription,
            whatYouwillLearn : whatYouwillLearn,
            price : price,
            url : response.secure_url,
            instructor : userExist._id,
            tags : tags,
            category : categoryExist._id,
            instructions : instructions
        });

        const updateUser = await User.findByIdAndUpdate(
            {_id:userExist._id},
            {
                $push : {
                    courses : newCourse._id
                }
            },
            {new : true}
        )

        const updateCategory = await Category.findByIdAndUpdate(
            {_id : categoryExist._id},
        {
            $push : 
            {
                course : newCourse._id
            }
        },
        {new : true}
    )
    
    return res.status(200).json({
        success : true,
        message : "Course created successfully",
        data : newCourse
    })
    }
    catch(error)
    {
        console.log("createcourse",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.getAllCourses = async (req,res)=>{
    try 
    {
        const response = await Course.find({}).populate("instructor").exec();

        return res.status(200).json({
            success : true,
            message : "Course fetched successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("getallcourses",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.myCourses = async(req,res)=>{
    try 
    {
        const userId = req.user.id;

        if(!userId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing fields"
            });
        }

        const myCourses = await User.findById(userId).populate("courses").exec();
        myCourses.password = undefined;
        
        return res.status(200).json({
            success : true,
            message : "My courses fetched successfully",
            data : myCourses
        })
    }
    catch(error)
    {
        console.log("mycourses",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.getCourseDetails = async (req,res) =>{
    try 
    {
        const {courseId} = req.body;

        if(!courseId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing fields"
            });
        }

        const response = await Course.find({_id : courseId})
                                .populate({
                                    path : "instructor",
                                    populate : {
                                        path : "additionalDetails"
                                    }
                                })
                                .populate("category")
                                .populate({
                                    path : "courseContent",
                                    options: { sort: { createdAt: 1 } },
                                    populate : {
                                        path : "subSection"
                                    }
                                })
                                .exec();

        if(!response)
        {
            return res.status(400).json({
                success : false,
                message : "No course found"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Course details fetched successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("getcoursedetails",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}
