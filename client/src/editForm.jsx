import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    city: '',
    profileImage: '',
    about: '',
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/user/me', { method:"GET",withCredentials: true });
        console.log('User Data:', res.data); 
        setFormData({
          email: res.data.email || '',
          username: res.data.username || '',
          city: res.data.city || '',
          profileImage: res.data.profileImage || '',
          about: res.data.about || '',
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setMsg('Error loading user info');
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/update', formData, {
        withCredentials: true,
      });
      setMsg('Profile updated successfully!');
    } catch (err) {
      console.error('Update failed:', err);
      setMsg(`Failed to update profile: ${err.response?.data?.msg || err.message}`);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Profile</h2>
      {msg && <div className="alert alert-info">{msg}</div>}
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address (readonly)</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="profileImage" className="form-label">Profile Image URL</label>
          <input
            type="url"
            className="form-control"
            id="profileImage"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
          />
        </div>

        {formData.profileImage && (
          <div className="mb-3">
            <img
              src={formData.profileImage}
              alt="Preview"
              className="img-thumbnail"
              style={{ width: '150px' }}
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="about" className="form-label">About</label>
          <textarea
            className="form-control"
            id="about"
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default EditForm;
