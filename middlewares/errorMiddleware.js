// Handle 404 Errors
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      message: 'The requested resource was not found.',
      error: 'Not Found',
    });
  };
  
  // Custom Error Handling Middleware
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    res.status(err.status || 500).json({
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { notFoundHandler, errorHandler };
  