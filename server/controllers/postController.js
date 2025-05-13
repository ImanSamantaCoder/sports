import Post from "../models/Post.js"
import User from "../models/User.js";
export const getCityPosts = async (req,res) =>{
    try{
       const user = await User.findById(req.user.id);
       if(!user) return res.status(404).json({msg:"User not found"});
       const posts = await Post.find({city:user.city}).populate('user','username profileImage');
       res.status(200).json(posts);

    }catch(err)
    {
        console.error('Error fetching city-based posts:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
}