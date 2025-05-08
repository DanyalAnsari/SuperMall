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
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
  } catch (error) {
    logger.error('Token signing error:', error);
    throw new Error('Authentication token generation failed');
  }
};

/**
 * Signs refresh token for extended authentication
 * @param {string} id - User ID
 * @returns {string} Refresh token
 */
const signRefreshToken = (id) => {
  try {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
  } catch (error) {
    logger.error('Refresh token signing error:', error);
    throw new Error('Refresh token generation failed');
  }
};

/**
 * Creates both access and refresh tokens
 * @param {string} id - User ID
 * @returns {Object} Object containing access and refresh tokens
 */
const createTokens = (id) => {
  try {
    const accessToken = signToken(id);
    const refreshToken = signRefreshToken(id);
    
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    logger.error('Token creation error:', error);
    throw new Error('Token generation failed');
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
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
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
  signRefreshToken,
  createTokens,
  sendAuthSuccessResponse,
  sendSuccessResponse,
  filterReqObj,
  formatCurrency,
  getPaginationMeta
};
