const Subsection = require('../model/Subsection.js');
const Section = require('../model/Section.js');
const fileUpload = require('../util/cloudinaryUpload.js');
require('dotenv').config();

exports.createSubSection = async (req,res)=>{
    try 
    {
        const {title,timeDuration,description,sectionId} = req.body;
        const video = req.files.videoFile;
        
        console.log(title,timeDuration,description,sectionId)
        if(!title || !timeDuration || !description || !video || !sectionId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            }) 
        }

        const newVideo = await fileUpload(video,process.env.FOLDER)

        const newSubSection = await Subsection.create({title,timeDuration,description,url : newVideo.secure_url});

        const updateSection = await Section.findByIdAndUpdate(sectionId,{
            $push : 
            {
                subSection : newSubSection._id
            }
        },
        { new : true}
        ).populate("subSection").exec();
        
        return res.status(200).json({
            success : true,
            message : "Subsection created successfully",
            data : {
                newSubSection,
                updateSection
            }
        })

    }
    catch(error)
    {
        console.log("Create sub section",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.updateSubSection = (req,res)=>{
    try 
    {
        
    }
    catch(error)
    {
        console.log("Update subsection",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.deleteSubSection = async (req,res)=>{
    try 
    {
        const {subSectionId} = req.params;

        if(!subSectionId)
        {
            return res.status(400).json({
                success : false,
                message : "Missing credentials"
            }) 
        }

        const response = await Subsection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success : true,
            message : "Subsection deleted successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("Delete subsection",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}