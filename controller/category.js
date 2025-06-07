const Category = require('../model/Category.js');


exports.createCategory = async (req,res)=>{
    try 
    {
        const {name,description} = req.body;

        if(!name || !description)
        {
            return res.status(400).json({
                success : false, 
                message : "All fields are required"
            })
        }

        const response = await Category.create({name,description});

        return res.status(200).json({
            success : true,
            message : "Category created successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("createcategory",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

// done
exports.getAllCategory = async (req,res)=>{
    try 
    {
        const response = await Category.find({});

        return res.status(200).json({
            success : true,
            message : "Category fetched successfully",
            data : response
        })
    }
    catch(error)
    {
        console.log("getallcategory",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}

exports.categoryPageDetails = async (req,res)=>{
    try 
    {
        const {categoryId} = req.body;

        if(!categoryId)
        {
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }

        const selectedCategory = await Category.find({__id : categoryId})
                                        .populate("course")
                                        .exec();
        
        if(!selectedCategory)
        {
            return res.status(404).json({
                success : false,
                message : "Category not found"
            })
        }

        const differentCategory = await Category.find({__id : {$ne : categoryId}})
                                            .populate("course").
                                            exec();

        const topSellingCategory = await Category.find({})
                                            .populate("course")
                                            .exec();

        return res.status(200).json({
            success : true,
            message : "Category page details fetched successfully",
            data : {
                selectedCategory,
                differentCategory,
                topSellingCategory
            }
        })
        
    }
    catch(error)
    {
        console.log("categorypagedetails",error.message);
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}