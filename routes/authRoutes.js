const express = require('express');
const { login, register } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.post('/register', register);

// ✅ Added a test route for debugging
router.get('/', (req, res) => {
  res.json({ message: 'Auth API is working!' });
});

module.exports = router;
