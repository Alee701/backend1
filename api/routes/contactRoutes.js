const express = require('express');
const router = express.Router();
const { sendContactForm } = require('../controllers/contactController');

// Route for submitting contact form
router.post('/', sendContactForm);

module.exports = router;