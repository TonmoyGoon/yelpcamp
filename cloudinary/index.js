const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// cloudinary is a place where we store our uploaded image file and 
//they gave us a link which we store in database

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "YelpCamp",
        allowedFormats: ["jpeg", "png", "jpg"]
    }
})

module.exports = {
    cloudinary,
    storage
}