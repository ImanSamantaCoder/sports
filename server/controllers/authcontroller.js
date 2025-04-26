import  nodemailer from 'nodemailer';
import bycrypt from 'bcrypt';
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();
const otpStore = {};
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
export const sendOtp = async (req, res) => {
    const { email, username, password, city } = req.body;
  
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ msg: 'Email already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = generateOTP();
  
      otpStore[email] = {
        otp,
        data: { email, password: hashedPassword, username, city },
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      };
  
      await transporter.sendMail({
        from: `"SportBuddy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for SportBuddy Registration',
        text: `Your OTP is: ${otp}`,
      });
  
      return res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error while sending OTP' });
    }
  };

  export const verifyOtpOnly = (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
  
    if (!record) return res.status(400).json({ msg: 'No OTP found for this email' });
    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ msg: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
  
    return res.json({ msg: 'OTP verified successfully' });
  };
  
  export const registerUser = async (req, res) => {
    const { email } = req.body;
    const record = otpStore[email];
  
    if (!record) return res.status(400).json({ msg: 'OTP verification required' });
  
    try {
      const newUser = new User(record.data);
      await newUser.save();
      delete otpStore[email];
  
      return res.json({ msg: 'Registration successful' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error during registration' });
    }
  };
  export const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      return res.json({
        msg: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          city: user.city,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error during login' });
    }
  };
  export const sendOtpForReset =  async (req,res) =>{
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
      const otp = generateOTP();
      otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      };
      await transporter.sendMail({
        from: `"SportBuddy" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP for SportBuddy Password Reset',
        text: `Your OTP is: ${otp}`,
      });
      return res.json({ msg: 'OTP sent to your email' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Server error while sending OTP' });
    }
  }
  export const verifyResetOtp = (req, res) => {
    const { email, otp } = req.body;
    const record = otpStore[email];
  
    if (!record) return res.status(400).json({ msg: 'No OTP found for this email' });
    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ msg: 'OTP expired' });
    }
    if (record.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
  
    return res.json({ msg: 'OTP verified successfully' });
  };
  export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const record = otpStore[email];
  
    if (!record) return res.status(400).json({ msg: 'OTP verification required' });
  
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate({ email }, { password: hashedPassword });
      delete otpStore[email];
  
      return res.json({ msg: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: 'Error resetting password' });
    }
  };
    

      