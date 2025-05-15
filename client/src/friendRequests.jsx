import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pending friend requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/friends/requests/pending', {
          withCredentials: true, // Needed to send cookies
        });
        setRequests(res.data.pendingRequests);
      } catch (err) {
        console.error('Error fetching friend requests:', err);
        setError('Failed to load friend requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading friend requests...</p>;
  if (error) return <p>{error}</p>;
  if (requests.length === 0) return <p>No pending friend requests</p>;

  return (
    <div>
      <h2>Pending Friend Requests</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {requests.map((req) => (
          <li key={req._id} style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px',backgroundColor:"#d0efff" }}>
              <img
                src={req.from.profileImage}
                alt={`${req.from.username}'s profile`}
                style={{ height: '100px', width: '100px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{req.from.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequest;
