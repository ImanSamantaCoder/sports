import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cities',{withCredentials:true});
      setCities(res.data);
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.trim()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/cities', { city: newCity });
      setCities([...cities, res.data]);
      setNewCity('');
      setShowModal(false);
    } catch (err) {
      console.error('Error adding city:', err);
    }
  };

  const handleDeleteCity = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cities/${id}`);
      setCities(cities.filter(city => city._id !== id));
    } catch (err) {
      console.error('Error deleting city:', err);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={styles.nav}>
        <h2>Admin Dashboard</h2>
        <a href="/home">Home</a>
        <button onClick={() => setShowModal(true)} style={styles.link}>
          Create City
        </button>
        
      </nav>
     
      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>Add New City</h3>
            <form onSubmit={handleAddCity} style={styles.form}>
              <input
                type="text"
                placeholder="Enter city name"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Add</button>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>Close</button>
            </form>
          </div>
        </div>
      )}

      {/* List of cities */}
      <ul style={styles.list}>
        {cities.map((city) => (
          <li key={city._id} style={styles.listItem}>
            {city.city}
            <button onClick={() => handleDeleteCity(city._id)} style={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Styles
const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: '#333',
    color: '#fff'
  },
  link: {
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    padding: '0.5rem 1rem',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.5rem'
  },
  button: {
    padding: '0.5rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  closeButton: {
    padding: '0.5rem',
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    cursor: 'pointer'
  },
  list: {
    listStyleType: 'none',
    padding: '1rem'
  },
  listItem: {
    backgroundColor: '#f0f0f0',
    marginBottom: '0.5rem',
    padding: '0.5rem 1rem',
    display: 'flex',
    justifyContent: 'space-between'
  },
  deleteButton: {
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    padding: '0.3rem 0.7rem',
    cursor: 'pointer'
  }
};

export default AdminDashboard;
