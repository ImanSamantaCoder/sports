import express from 'express';
import {
  sendOtp,
  verifyOtpOnly,
  registerUser,
  login,
  sendOtpForReset,
  verifyResetOtp,
  resetPassword,
} from '../controllers/authcontroller.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtpOnly);
router.post('/register', registerUser);
router.post('/login', login);
router.post('/forget-password', login);
router.post('/send-reset-otp', sendOtpForReset);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

export default router;
