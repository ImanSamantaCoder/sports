import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },     // unique identifier
  password: { type: String, required: true },                 // securely hashed (hopefully in controller)
  username: { type: String, required: true },                 // display name
  city: { type: String, required: true },                     // from dropdown (validated on frontend)
  profileImage: { type: String, default: '' },                // optional profile picture
  about: { type: String, default: '' },                       // optional bio/about
});


export default mongoose.model('User', userSchema);
