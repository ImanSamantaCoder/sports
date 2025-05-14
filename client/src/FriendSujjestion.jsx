import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Friends = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestedUsers, setRequestedUsers] = useState(new Set()); // track sent requests

  useEffect(() => {
    const fetchSuggestionsAndRequests = async () => {
      try {
        const [suggestRes, sentRes] = await Promise.all([
          axios.get('http://localhost:5000/api/friends/suggestions', {
            withCredentials: true,
          }),
          axios.get('http://localhost:5000/api/friends/requests/sent', {
            withCredentials: true,
          }),
        ]);

        setSuggestions(suggestRes.data);
        setRequestedUsers(new Set(sentRes.data.map((req) => req.to))); // assuming `to` is the recipient ID
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestionsAndRequests();
  }, []);

  const handleSendRequest = async (toUserId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/friends/request/${toUserId}`,
        {},
        { withCredentials: true }
      );

      setRequestedUsers((prev) => new Set(prev).add(toUserId));
    } catch (error) {
      console.error('Error sending friend request:', error.response?.data || error.message);
      alert('Failed to send request.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      {loading ? (
        <p>Loading suggestions...</p>
      ) : suggestions.length === 0 ? (
        <p>No suggestions available.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {suggestions.map((user) => (
            <div
              key={user._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1rem',
                width: '400px',
                textAlign: 'center',
                backgroundColor: '#03fce3',
              }}
            >
              <img
                src={user.profileImage || 'https://via.placeholder.com/100'}
                alt={user.username}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '0.5rem',
                }}
              />
              <h4>{user.username}</h4>
              <p style={{ fontSize: '0.9rem', color: 'gray' }}>{user.city}</p>
              <button
                className="btn btn-success"
                onClick={() => handleSendRequest(user._id)}
                disabled={requestedUsers.has(user._id)}
              >
                {requestedUsers.has(user._id) ? 'Request Sent' : 'Request Friendship'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
