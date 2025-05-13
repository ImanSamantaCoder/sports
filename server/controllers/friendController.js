import User from '../models/User.js';




export const suggestFriends = async (req, res) => {
  try {
    console.log("🔥 suggestFriends called");

    // Check if req.user is present
    if (!req.user) {
      console.log('❌ No user in request');
      return res.status(400).json({ msg: 'User not authenticated' });
    }
    console.log(req.user);
    const currentUserId = req.user.id;  // You may replace this with a hardcoded ID for now
    if (!currentUserId) {
      return res.status(400).json({ msg: 'User ID is missing in the request' });
    }

    // Find current user in DB
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find friends in the same city and not in current user's friends list
    const usersInSameCity = await User.find({
      city: currentUser.city,
      _id: { $ne: currentUserId, $nin: currentUser.friends }
    }).select('-password');

    return res.status(200).json(usersInSameCity);
  } catch (err) {
    console.error('❌ Error fetching friend suggestions:', err);
    return res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
