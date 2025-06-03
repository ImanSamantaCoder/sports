import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import User from './models/User.js';
dotenv.config();
import uploadRoute from './routes/upload.js';
import post from "./routes/post.js"
import friendRoutes from './routes/friendRoutes.js';
import cityRoutes from "./routes/cityRoutes.js"
const app = express();
const PORT = process.env.PORT || 5000;
 // ✅ correct import for default

// Middleware
import postRoutes from "./routes/postRoutes.js";

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  credentials: true
}));
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/posts', postRoutes);
app.use('/api/post', post);
app.use('/api/friends', friendRoutes);
app.use('/api/cities', cityRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
