const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true, 
    unique: true,   
  },
  cnic: {
    type: String,
    required: true, 
    unique: true,  
  },
  password:{
    type: String,
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
