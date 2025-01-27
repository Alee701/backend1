const express = require('express');
const dotenv = require('./Config/dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');
const morgan = require('morgan'); // For advanced logging
const helmet = require('helmet'); // For security headers
const rateLimit = require('express-rate-limit'); // For rate limiting
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(helmet()); // Add security headers
app.use(morgan('dev')); // Logging for development

// Rate Limiting (Prevent DoS attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', apiLimiter); // Apply rate limiting to all API routes

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/loans', loanRoutes); // Loan-related routes
app.use('/api/admin', adminRoutes); // Admin-related routes
app.use('/api/notifications', notificationRoutes); // Notification-related routes

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is up and running!', uptime: process.uptime() });
});

// Handle 404 (Not Found)
app.use(notFoundHandler);

// Custom Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
