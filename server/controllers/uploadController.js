// controllers/uploadController.js
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'profile_images' },
      (error, result) => {
        if (error) return res.status(500).json({ error });
        return res.json({ url: result.secure_url });
      }
    );
    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
};

module.exports = { uploadImage };
