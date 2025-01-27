const dotenv = require('dotenv');

module.exports = () => {
  dotenv.config();
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Missing required environment variables in .env');
  }
};
