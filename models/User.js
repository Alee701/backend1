const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Define user roles
      default: 'user',
    },
    phone: {
      type: String,
      default: null, // Optional phone number
    },
    address: {
      type: String,
      default: null, // Optional address
    },
    resetToken: {
      type: String,
      default: null, // For password reset functionality
    },
    resetTokenExpiry: {
      type: Date,
      default: null, // Expiry for the reset token
    },
  },
  { timestamps: true } // Add createdAt and updatedAt timestamps
);

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
