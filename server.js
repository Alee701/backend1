const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const loanRoutes = require('./routes/loanRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cors = require('cors');
const morgan = require('morgan'); 
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'https://vercel.app'], // Allow frontend & Vercel
  credentials: true, 
}));
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
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running!', uptime: process.uptime() });
});

// Handle 404 (Not Found)
app.use(notFoundHandler);

// Custom Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
