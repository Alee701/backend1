const mongoose = require('mongoose');

const guarantorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  cnic: {
    type: String,
    required: true,
  },
});

const loanRequestSchema = new mongoose.Schema({
  loanDetails: {
    amount: {
      type: Number,
    },
    purpose: {
      type: String,
    },
    duration: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  guarantors: [guarantorSchema],
  documents: {
    statement: {
      type: String, 
      default: null,
    },
    salarySheet: {
      type: String, 
      default: null,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const LoanRequest = mongoose.model('LoanRequest', loanRequestSchema);

module.exports = LoanRequest;