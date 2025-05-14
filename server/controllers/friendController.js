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
import FriendRequest from '../models/friendRequest.js';// if you want to check if users exist

export const sendFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.user.id; // assuming verifyToken adds user info to req.user
    const toUserId = req.params.toUserId;

    if (fromUserId === toUserId) {
      return res.status(400).json({ message: "You can't send a friend request to yourself." });
    }

    // Optional: Check if the user exists
    // const toUser = await User.findById(toUserId);
    // if (!toUser) {
    //   return res.status(404).json({ message: 'Recipient user not found' });
    // }

    // Check if a request already exists
    const existingRequest = await FriendRequest.findOne({
      from: fromUserId,
      to: toUserId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }

    const newRequest = new FriendRequest({
      from: fromUserId,
      to: toUserId,
    });

    await newRequest.save();

    res.status(201).json({ message: 'Friend request sent successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
};
export const getSentRequests = async (req, res) => {
  try {
    const fromUserId = req.user.id;
    const sentRequests = await FriendRequest.find({ from: fromUserId }).select('to');
    res.json(sentRequests); // returns [{ to: userId1 }, { to: userId2 }]
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
};

