import express from 'express';
const router = express.Router();
import {
  getAllCities,
  
  createCity,
  deleteCity
} from '../controllers/cityController.js';

// GET all cities
router.get('/', getAllCities);
// POST create a city
router.post('/', createCity);

// DELETE a city by ID
router.delete('/:id', deleteCity);

export default router;
