import express from 'express';
import {verifyToken,verifyAdmin} from '../middleware/auth.js';
import { suggestFriends,sendFriendRequest,getSentRequests,getPendingFriendRequests,acceptFriendRequest,getFriends } from '../controllers/friendController.js';

const router = express.Router();
router.get('/', verifyToken, getFriends);

router.get('/suggestions',verifyToken,suggestFriends);
router.post('/request/:toUserId', verifyToken, sendFriendRequest);
router.get('/requests/sent', verifyToken, getSentRequests);
router.get('/requests/pending', verifyToken, getPendingFriendRequests);
router.put('/requests/accept/:id', verifyToken, acceptFriendRequest);

export default router;
