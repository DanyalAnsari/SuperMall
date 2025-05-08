const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const util = require("util");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");
const CustomError = require("../utils/CustomError");

/**
 * Sets auth cookies for both access and refresh tokens
 * @param {Object} res - Express response object
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - JWT refresh token
 */
const setAuthCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Set refresh token cookie (long-lived)
  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  // Set access token cookie (short-lived)
  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  });
};

/**
 * Clears auth cookies
 * @param {Object} res - Express response object
 */
const clearAuthCookies = (res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res.cookie('refresh_token', 'logged_out', {
    ...cookieOptions,
    expires: new Date(Date.now() + 10 * 1000) // 10 seconds
  });

  res.cookie('access_token', 'logged_out', {
    ...cookieOptions,
    expires: new Date(Date.now() + 10 * 1000) // 10 seconds
  });
};

/**
 * Restricts access based on user roles
 * @param {...string} roles - Roles that have access
 * @returns {Function} Middleware
 */
const restrict = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (![...roles, "Superadmin"].includes(userRole)) {
      return next(
        new CustomError("You are not authorized to perform this action", 403)
      );
    }
    next();
  };
};

/**
 * Extracts token from various sources in the request
 * @param {Object} req - Express request object
 * @returns {string|null} Extracted token or null
 */
const extractToken = (req) => {
  // Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  
  // Check cookies
  if (req.cookies) {
    if (req.cookies.jwt) return req.cookies.jwt;
    if (req.cookies.access_token) return req.cookies.access_token;
  }
  
  // Check query params as last resort (less secure)
  if (req.query && req.query.token) {
    return req.query.token;
  }
  
  return null;
};

/**
 * Authentication middleware
 */
const protect = asyncErrorHandler(async (req, res, next) => {
  // Extract token
  const token = extractToken(req);
    
  if (!token) {
    return next(new CustomError("Authentication required! Please login to continue.", 401));
  }

  try {
    // Verify token
    const decodedToken = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    // Get user
    const user = await UserModel.findById(decodedToken.id);

    if (!user) {
      return next(
        new CustomError("User associated with this token no longer exists!", 401)
      );
    }

    // Check if password was changed after token was issued
    if (await user.isPasswordChanged(decodedToken.iat)) {
      return next(
        new CustomError("Password was recently changed. Please login again!", 401)
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return next(
        new CustomError("Your account is deactivated. Please contact support.", 401)
      );
    }

    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    return next(
      new CustomError("Invalid authentication token. Please login again.", 401)
    );
  }
});

module.exports = { 
  protect, 
  restrict, 
  extractToken,
  setAuthCookies,
  clearAuthCookies
};
