import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Post = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/posts/my-city', {
          withCredentials: true,
        });
        console.log('Fetched posts:', res.data);
        setPosts(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching posts:', error.response ? error.response.data : error.message);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      
      <div className="row justify-content-center">
        {posts.length === 0 ? (
          <p className="text-center">No posts found in your city.</p>
        ) : (
          posts.map((post) => (
            <div className="col-md-8 mb-4" key={post._id}>
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body">
                  {/* User Info */}
                  <div className="d-flex align-items-center mb-3">
                    <img
                      src={post.user?.profileImage || 'https://via.placeholder.com/40'}
                      alt="Profile"
                      className="rounded-circle me-3"
                      width="40"
                      height="40"
                    />
                    <strong>{post.user?.username || 'Unknown'}</strong>
                  </div>
                    <p className="card-text mt-3">{post.description}</p>
                  {/* Post Image */}
                  {post.image && (
                    <div style={{ overflow: 'hidden'}}>
                      <img
                        src={post.image}
                        alt="Post"
                        className="img-fluid rounded-3"
                        style={{
                          objectFit: 'cover',  // Ensure image covers the container without stretching
                          width: '100%',
                          height: '100%',
                        }}
                      />
                    </div>
                  )}

                  
                  
                  <p className="text-muted small">City: {post.city}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Post;
