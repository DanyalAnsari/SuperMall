const jwt = require("jsonwebtoken");
const logger = require("./logger");

/**
 * Signs JWT token for authentication
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const signToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  } catch (error) {
    logger.error('Token signing error:', error);
    throw new Error('Authentication token generation failed');
  }
};

/**
 * Sends response with JWT token
 * @param {Object} data - Response data
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendAuthSuccessResponse = (res, statusCode, data) => {
  try {
    const token = signToken(data._id);
    const cookieOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res
    .cookie("jwt", token, cookieOptions)
    .status(statusCode)
      .json({ 
        status: "success", 
        token, 
        data,
        timestamp: new Date().toISOString()
      });
  } catch (error) {
    logger.error('Response error:', error);
    throw new Error('Failed to send authenticated response');
  }
};

/**
 * Sends success response with timestamp
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
const sendSuccessResponse = (res, statusCode, data) => {
  res.status(statusCode).json({
    status: 'success',
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Filters object properties
 * @param {Object} obj - Source object
 * @param {string[]} allowedFields - Allowed field names
 * @returns {Object} Filtered object
 */
const filterReqObj = (obj, allowedFields) => {
  let newObj = {};
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) {
      newObj[prop] = obj[prop];
    }
  });
  
  return newObj;
};

/**
 * Formats price to currency string
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

/**
 * Generates pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const getPaginationMeta = (total, page, limit) => {
  return {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
};

module.exports = {
  signToken,
  sendAuthSuccessResponse,
  sendSuccessResponse,
  filterReqObj,
  formatCurrency,
  getPaginationMeta
};
