const cloudinary = require('cloudinary').v2;

const fileUpload = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }

        options.resource_type = "auto";

        const response = await cloudinary.uploader.upload(file.tempFilePath, options);

        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = fileUpload;
