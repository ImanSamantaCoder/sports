import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import verifyToken from '../middleware/auth.js'; // ✅ correct import for default

import cloudinary from '../config/cloudinary.js';
import Post from '../models/Post.js';

const router = express.Router();

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route: Create Post
router.post('/create', verifyToken, upload.single('image'), async (req, res) => {
  const { description,city } = req.body;
   console.log(req);
  if (!description || !req.file) {
    return res.status(400).json({ message: 'Description and image are required.' });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'posts',
    });
    
    const newPost = new Post({
      user: req.user.id,
      description,
      city,
      image: result.secure_url,
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
