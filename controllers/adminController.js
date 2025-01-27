const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/sendEmail');

// Get all loans with pagination and filters
const getAllLoans = async (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;

  try {
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { 'userDetails.email': { $regex: search, $options: 'i' } },
      ];
    }

    const loans = await Loan.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email');

    const totalLoans = await Loan.countDocuments(query);

    res.json({
      loans,
      totalPages: Math.ceil(totalLoans / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch loans', error: err.message });
  }
};

// Update loan status and notify users
const updateLoanStatus = async (req, res) => {
  const { loanId } = req.params;
  const { status, comment } = req.body;

  try {
    const loan = await Loan.findById(loanId).populate('userId', 'email name');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.status = status;
    loan.adminComment = comment || '';
    await loan.save();

    // Notify user
    const message = `Your loan application (${loan.type}) has been ${status}. ${
      comment ? `Admin Comment: ${comment}` : ''
    }`;
    await Notification.create({ userId: loan.userId, message });

    // Send email notification
    sendEmail({
      to: loan.userId.email,
      subject: `Loan Status Update: ${status}`,
      text: message,
    });

    res.json({ message: 'Loan status updated successfully', loan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update loan status', error: err.message });
  }
};

// Schedule an appointment
const scheduleAppointment = async (req, res) => {
  const { loanId } = req.params;
  const { date, time } = req.body;

  try {
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    loan.appointment = { date, time };
    await loan.save();

    const message = `Your loan appointment has been scheduled for ${date} at ${time}.`;
    await Notification.create({ userId: loan.userId, message });

    res.json({ message: 'Appointment scheduled successfully', loan });
  } catch (err) {
    res.status(500).json({ message: 'Failed to schedule appointment', error: err.message });
  }
};

module.exports = { getAllLoans, updateLoanStatus, scheduleAppointment };
