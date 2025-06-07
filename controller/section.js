const mongoose = require('mongoose');
const Section = require('../model/Section.js');
const Course = require('../model/Course.js');

// done
exports.createSection = async (req,res)=>{
    try
    {
        const {sectionName,courseId} = req.body;

        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            })
        }

        const response = await Section.create({sectionName})

        const updateCourse = await Course.findByIdAndUpdate(   
            {_id : courseId},
            {
                $push : 
                {
                    courseContent : response._id
                }
            },
            { new : true}
        )

        return res.status(200).json({
            success : true,
            message : "Section created successfully",
            data : {
                    response,
                    updateCourse
            }
        })
    }
    catch(error)
    {
        console.log("Create section",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}


exports.updateSection = async (req,res)=>{
    try 
    {
        const {sectionId,newSectionName} = req.body;

        if(!sectionId || !newSectionName)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            })
        }

        const response = await Section.findByIdAndUpdate(
            sectionId,
            {
                sectionName : newSectionName
            },
            {new : true}
        );

        return res.status(200).json({
            success : true,
            message : "Section Updated successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("Update section",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.deleteSection = async (req,res) =>
{
    try 
    {
        const sectionId = req.params;

        if(!sectionId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            })
        }

        const response = await Section.findByIdAndDelete(sectionId.id);

        return res.status(200).json({
            success : true,
            message : "Section deleted successfully"
        })
    }
    catch(error)
    {
        console.log("Delete section",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}