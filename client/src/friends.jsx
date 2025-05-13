import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Friends = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sentRequests, setSentRequests] = useState({});

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/friends/suggestions', {
          withCredentials: true,
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching friend suggestions:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleSendRequest = async (userId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/friends/request/${userId}`,
        {},
        { withCredentials: true }
      );
      setSentRequests((prev) => ({ ...prev, [userId]: true }));
    } catch (error) {
      console.error('Error sending friend request:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Friend Suggestions</h2>

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
                width: '200px',
                textAlign: 'center',
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
                onClick={() => handleSendRequest(user._id)}
                disabled={sentRequests[user._id]}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '5px',
                  border: 'none',
                  backgroundColor: sentRequests[user._id] ? '#ccc' : '#007bff',
                  color: '#fff',
                  cursor: sentRequests[user._id] ? 'not-allowed' : 'pointer',
                }}
              >
                {sentRequests[user._id] ? 'Request Sent' : 'Send Request'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Friends;
