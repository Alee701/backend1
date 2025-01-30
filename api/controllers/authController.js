const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/sendEmail');

// Generate token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to log in', error: err.message });
  }
};

// Register
const register = async (req, res) => {
  const { name, email, password, phone, role = 'user' } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(400).json({ message: 'Failed to register user', error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = generateToken(user.id);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Send email with reset link
    sendEmail({
      to: email,
      subject: 'Password Reset',
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.json({ message: 'Password reset link sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset link', error: err.message });
  }
};

module.exports = { login, register, resetPassword };
