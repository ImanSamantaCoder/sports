import User from '../models/User.js';
import FriendRequest from '../models/friendRequest.js';



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
export const getPendingFriendRequests =async (req,res)=>{
  try{
     const userId = req.user.id;
     const requests = await FriendRequest.find({to:userId,status:'pending'}).populate('from','username profileImage');
     console.log(requests);
     res.status(200).json({pendingRequests:requests});
  }catch(error){
      console.error('error fetching friend requests',error.message);
      res.status(500).json({message:"server error"});
  }
}


// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const fromUserId = req.params.id;       // Sender's ID (from)
    const toUserId = req.user.id;           // Logged-in user (to)

    // Find the friend request
    const request = await FriendRequest.findOne({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ msg: 'Friend request not found' });
    }

    // Update status to accepted
    request.status = 'accepted';
    await request.save();

    return res.status(200).json({ msg: 'Friend request accepted' });
  } catch (err) {
    console.error('Error accepting friend request:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all accepted friend requests where user is either sender or receiver
    const friends = await FriendRequest.find({
      status: 'accepted',
      $or: [
        { from: userId },
        { to: userId },
      ]
    })
      .populate('from', 'username profileImage') // populate only useful fields
      .populate('to', 'username profileImage');

    // Transform to return actual friends (not self)
    const friendList = friends.map((fr) => {
      const isSender = fr.from._id.toString() === userId;
      return isSender ? fr.to : fr.from;
    });

    res.status(200).json({ friends: friendList });
  } catch (err) {
    console.error('Error fetching friends:', err);
    res.status(500).json({ msg: 'Failed to fetch friends', error: err.message });
  }
};


