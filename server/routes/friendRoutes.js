import express from 'express';
import verifyToken from '../middleware/auth.js';
import { suggestFriends } from '../controllers/friendController.js';

const router = express.Router();

router.get('/suggestions',verifyToken,suggestFriends);

export default router;
