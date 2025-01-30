const express = require('express');
const dotenv = require('dotenv'); 
dotenv.config();
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

// ✅ Dynamic CORS configuration
const allowedOrigins = [process.env.FRONTEND_URL, 'https://hackathon1-psi-roan.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

app.use(express.json()); 
app.use(helmet()); 
app.use(morgan('dev')); 

// ✅ Rate Limiting (Prevent DoS attacks), but exclude `/api/health`
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', apiLimiter); 

// ✅ Health Check (excluded from rate limiting)
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running!', uptime: process.uptime() });
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

// Handle 404 (Not Found)
app.use(notFoundHandler);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;  // ✅ Ensures proper export for Vercel
