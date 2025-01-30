const express = require('express');
const { submitLoan, getLoans } = require('../controllers/loanController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', protect, submitLoan);
router.get('/', protect, getLoans);

module.exports = router;
