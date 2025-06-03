import express from 'express';
import {verifyToken,verifyAdmin} from '../middleware/auth.js';
import { getCityPosts } from '../controllers/postController.js';

const router = express.Router();

router.get('/my-city', verifyToken, getCityPosts);

export default router;
