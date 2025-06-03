import City  from '../models/City.js';

// Get all cities
export const getAllCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cities' });
  }
};
// Create a new city
export const createCity = async (req, res) => {
  try {
    const { city } = req.body;
    const newCity = new City({ city });
    await newCity.save();
    res.status(201).json(newCity);
  } catch (err) {
    res.status(400).json({ message: 'Error creating city', error: err.message });
  }
};

// Delete a city
export const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await City.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'City not found' });
    res.status(200).json({ message: 'City deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting city' });
  }
};


