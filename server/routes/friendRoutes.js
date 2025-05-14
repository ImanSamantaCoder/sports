import express from 'express';
import verifyToken from '../middleware/auth.js';
import { suggestFriends,sendFriendRequest,getSentRequests } from '../controllers/friendController.js';

const router = express.Router();

router.get('/suggestions',verifyToken,suggestFriends);
router.post('/request/:toUserId', verifyToken, sendFriendRequest);
router.get('/requests/sent', verifyToken, getSentRequests);

export default router;
