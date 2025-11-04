const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../configs/cloudinary");

// Cấu hình multer để lưu trực tiếp vào Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = "courses/others";
        if (file.fieldname === "imageUrl") folder = "courses/images";
        if (file.fieldname === "videoUrl") folder = "courses/videos";

        return {
            folder,
            resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
            format: file.mimetype.split("/")[1], // jpg, png, mp4...
            public_id: Date.now().toString(),
        };
    },
});

const upload = multer({ storage });

module.exports = upload;