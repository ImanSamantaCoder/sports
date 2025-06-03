import React, { useEffect, useState } from "react";
import axios from "axios";
import cityOptions from "./cityOptions"; // adjust the path as needed

const EditForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    city: "",
    profileImage: "",
    about: "",
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/user/me", {
          withCredentials: true,
        });
        setFormData({
          email: res.data.email || "",
          username: res.data.username || "",
          city: res.data.city || "",
          profileImage: res.data.profileImage || "",
          about: res.data.about || "",
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMsg("Error loading user info");
        setLoading(false);
      }
    };
    const fetchCities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cities',{withCredentials:true});
      setCities(res.data);
      console.log(res.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };
    fetchUser();
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("image", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:5000/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData((prev) => ({ ...prev, profileImage: res.data.url }));
      setMsg("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      setMsg("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/auth/update", formData, {
        withCredentials: true,
      });
      setMsg("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setMsg(
        `Failed to update profile: ${err.response?.data?.msg || err.message}`
      );
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Edit Profile</h2>
      {msg && <div className="alert alert-info">{msg}</div>}

      {/* Show the image preview at the top, centered and rounded */}
      {formData.profileImage && (
        <div className="mb-3 d-flex justify-content-center">
          <img
            src={formData.profileImage}
            alt="Profile Preview"
            className="img-thumbnail"
            style={{
              width: "200px", // Increased width
              height: "200px", // Increased height
              objectFit: "contain", // Ensures image isn't cropped
              borderRadius: "50%", // Makes the image circular
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address (readonly)
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={formData.email}
            disabled
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
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
          <label htmlFor="city" className="form-label">
            City
          </label>
          <select
            className="form-select"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
                
              <option key={city.city} value={city.city}>
                {city.city}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">
            Upload Profile Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="imageUpload"
            onChange={handleImageUpload}
          />
          {uploading && <p>Uploading...</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="about" className="form-label">
            About
          </label>
          <textarea
            className="form-control"
            id="about"
            name="about"
            rows="3"
            value={formData.about}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default EditForm;
