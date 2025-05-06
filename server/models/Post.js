const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  city: { type: String, required: true }, // ✅ Added city field
});

module.exports = mongoose.model('Post', postSchema);
