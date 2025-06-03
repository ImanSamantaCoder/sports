import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Friend = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accepted friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/friends/', {
          withCredentials: true, // Needed to send JWT via cookie
        });
        setFriends(res.data.friends);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <p>Loading friends...</p>;
  if (error) return <p>{error}</p>;
  if (friends.length === 0) return <p>You have no friends yet.</p>;

  return (
    <div>
      <h2>Your Friends</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {friends.map((friend) => (
          <li key={friend._id} style={{ marginBottom: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                backgroundColor: '#e0ffe0',
                padding: '15px',
                borderRadius: '10px',
              }}
            >
              <img
                src={friend.profileImage}
                alt={`${friend.username}'s profile`}
                style={{
                  height: '80px',
                  width: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
              <span style={{ fontSize: '20px', fontWeight: '500' }}>{friend.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friend;
