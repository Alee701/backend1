const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getAllLoans, updateLoanStatus, scheduleAppointment } = require('../controllers/adminController');

const router = express.Router();

router.get('/loans', protect, getAllLoans);
router.put('/loans/:loanId', protect, updateLoanStatus);
router.post('/loans/:loanId/schedule', protect, scheduleAppointment);

module.exports = router;
