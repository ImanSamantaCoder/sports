import express from 'express';
import {
  sendOtp,
  verifyOtpOnly,
  registerUser,
  login,
  sendOtpForReset,
  verifyResetOtp,
  resetPassword,
  updateProfile
} from '../controllers/authcontroller.js';
import {verifyToken,verifyAdmin} from '../middleware/auth.js'; // ✅ correct import for default

import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpOnly);
router.post('/register', registerUser)
router.post('/login', login);
router.post('/forget-password', login);
router.post('/send-reset-otp', sendOtpForReset);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);
router.put('/update', verifyToken, updateProfile);
router.get('/user/me', verifyToken, async (req, res) => {
  try {
    console.log('req.user:', req.user); // Add this
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});


export default router;
