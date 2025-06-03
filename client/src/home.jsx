import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import cityOptions from './cityOptions';
import Post from './Post';

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    image: null,
    city: '',
  });
  const [user, setUser] = useState(null); // For user data including role
  
  useEffect(() => {
    // Fetch user info
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user/me', {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error.response?.data || error.message);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('description', formData.description);
    data.append('image', formData.image);
    data.append('city', formData.city);

    try {
      const response = await axios.post('http://localhost:5000/api/post/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log('Post submitted:', response.data);
      setShowModal(false);
      setFormData({ description: '', image: null, city: '' });
    } catch (error) {
      console.error('Error submitting post:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-4">
          <Link className="navbar-brand" to="/">SportsBuddy</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/AdminDashboard">Admin Dashboard</Link>
                </li>
              )}
              {user?.role != 'admin' &&(
              <li className="nav-item">
                <Link className="nav-link" to="/friends">Friends</Link>
              </li>)}
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              {user?.role !='admin' &&( <li className="nav-item">
                <Link className="nav-link create-post-link" to="#" onClick={() => setShowModal(true)}>Create Post</Link>
              </li>)}
             
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal for creating post */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Post</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Upload Image</label>
                    <input type="file" className="form-control" id="image" onChange={handleImageUpload} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <select className="form-select" id="city" name="city" value={formData.city} onChange={handleChange} required>
                      <option value="">Select your city</option>
                      {cityOptions.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Posts */}
      <div className="container mt-5">
        <Post />
      </div>
    </>
  );
};

export default Home;
