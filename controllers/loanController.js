const Loan = require('../models/Loan');

// Submit Loan Request
const submitLoan = async (req, res) => {
  const { type, amount, duration, guarantors, documents } = req.body;

  try {
    // Validate loan amount and duration
    if (amount <= 0 || duration <= 0) {
      return res.status(400).json({ message: 'Amount and duration must be greater than zero' });
    }

    const loan = await Loan.create({
      userId: req.user.id,
      type,
      amount,
      duration,
      guarantors,
      documents,
      token: `LN-${Date.now()}`,
      status: 'Pending', // Default status
    });

    res.status(201).json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit loan request', error: err.message });
  }
};

// Get all loans for the user (with pagination)
const getLoans = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  try {
    const query = { userId: req.user.id };
    if (status) query.status = status; // Filter by loan status

    const loans = await Loan.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalLoans = await Loan.countDocuments(query);

    res.json({
      loans,
      totalPages: Math.ceil(totalLoans / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch loans', error: err.message });
  }
};

// Get loan details by ID
const getLoanDetails = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findById(loanId).populate('userId', 'name email');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch loan details', error: err.message });
  }
};

// Delete Loan
const deleteLoan = async (req, res) => {
  const { loanId } = req.params;

  try {
    const loan = await Loan.findByIdAndDelete(loanId);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete loan', error: err.message });
  }
};

module.exports = {
  submitLoan,
  getLoans,
  getLoanDetails,
  deleteLoan,
};
