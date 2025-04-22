const CustomError = require("../utils/CustomError");
const logger = require("../utils/logger");


// Development error response
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
    timestamp: new Date().toISOString(),
    path: error.path
  });
};

// Production error response
const prodError = (res, error) => {
  // Operational, trusted errors
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message
    });
  } 
  // Programming or unknown errors
  else {
    logger.error('ERROR 💥', error);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Specific error handlers
const errorHandlers = {
  CastError: (err) => {
    const msg = `Invalid ${err.path}: ${err.value}`;
    return new CustomError(msg, 400);
  },

  ValidationError: (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const msg = `Invalid input data. ${errors.join('. ')}`;
    return new CustomError(msg, 400);
  },

  MongoServerError: (err) => {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      const msg = `Duplicate ${field}: ${value}. Please use another value.`;
      return new CustomError(msg, 400);
    }
    return err;
  },

  TokenExpiredError: () => 
    new CustomError('Your token has expired! Please log in again.', 401),

  JsonWebTokenError: () => 
    new CustomError('Invalid token! Please log in again.', 401),
};

// Error classifier
const classifyError = (error) => {
  if (error.name in errorHandlers) {
    return errorHandlers[error.name](error);
  }
  return error;
};

// Global error handler
const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  error.path = req.originalUrl;

  // Log all 500 errors
  if (error.statusCode === 500) {
    logger.error({
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
      method: req.method,
      body: req.body,
      timestamp: new Date().toISOString()
    });
  }

  const environment = process.env.NODE_ENV?.trim() || 'development';
  let handledError = environment === 'production' ? classifyError(error) : error;

  const errorHandler = environment === 'production' ? prodError : devErrors;
  errorHandler(res, handledError);
};

module.exports = globalErrorHandler;
