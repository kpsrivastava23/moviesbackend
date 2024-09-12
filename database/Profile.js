const mongoose = require('mongoose');

const newProfile = new mongoose.Schema({
    // Define the structure of your data
    name: String,
    email: {type : String, unique : true},
    gauth: String,
    picture: String,
  });
  
  // Create a model based on the schema
  const Profile = mongoose.model('Profile', newProfile);
  
  module.exports = Profile;