// models/city.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model('City', citySchema);
