const { UserModel } = require("../models/UserModel");
const {
  sendSuccessResponse,
  sendAuthSuccessResponse,
  signToken,
  createTokens,
} = require("../utils/Utilities");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const sendEmail = require("../utils/Email");
const { setAuthCookies, clearAuthCookies } = require("../middlewares/AuthMiddleware");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * User Registration Controller
 * @route POST /api/auth/signup
 * @access Public
 */
const signUpUser = asyncErrorHandler(async (req, res, next) => {
  // Prevent role escalation
  if (req.body.role === "Admin" && req.user && req.user.role !== "Superadmin") {
    return next(
      new CustomError("Only superadmins can create admin accounts", 403)
    );
  }

  // Create new user
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone_number: req.body.phone_number,
    address: req.body.address,
    role: req.body.role || "Customer",
  };

  let newUser = await UserModel.create(userData);

  // Remove sensitive data
  newUser = newUser.toObject();
  delete newUser.password;

  sendAuthSuccessResponse(res, 201, newUser);
});

/**
 * User Login Controller
 * @route POST /api/auth/login
 * @access Public
 */
const signInUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return next(new CustomError("Please provide email and password", 400));
  }

  // Find user and include password for comparison
  const user = await UserModel.findOne({ email }).select("+password").exec();

  // Validate credentials
  if (!user || !(await user.comparePassword(password))) {
    return next(new CustomError("Invalid credentials", 401));
  }

  // Check if account is active
  if (!user.isActive) {
    return next(new CustomError("Your account is deactivated. Please contact support.", 401));
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  // Create both access and refresh tokens
  const { accessToken, refreshToken } = createTokens(user._id);
  
  // Store refresh token in database
  user.refresh_token = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set auth cookies
  setAuthCookies(res, accessToken, refreshToken);

  sendSuccessResponse(res, 200, {
    user: userResponse,
    accessToken,
    refreshToken
  });
});

/**
 * User Logout Controller
 * @route POST /api/auth/logout
 * @access Private
 */
const logoutUser = asyncErrorHandler(async (req, res, next) => {
  // Clear refresh token in database
  if (req.user) {
    req.user.refresh_token = undefined;
    await req.user.save({ validateBeforeSave: false });
  }

  // Clear auth cookies
  clearAuthCookies(res);

  sendSuccessResponse(res, 200, {
    message: "Successfully logged out"
  });
});

/**
 * Refresh Token Controller
 * @route POST /api/auth/refresh-token
 * @access Public
 */
const refreshToken = asyncErrorHandler(async (req, res, next) => {
  // Get refresh token from cookie or body
  const tokenValue = req.cookies.refresh_token || req.body.refresh_token;

  if (!tokenValue) {
    return next(new CustomError("No refresh token provided", 401));
  }

  // Verify refresh token
  try {
    const decoded = jwt.verify(
      tokenValue, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );
    
    // Find user with matching refresh token
    const user = await UserModel.findOne({
      _id: decoded.id,
      refresh_token: tokenValue
    });

    if (!user) {
      return next(new CustomError("Invalid refresh token", 401));
    }

    // Check if account is active
    if (!user.isActive) {
      return next(new CustomError("Your account is deactivated. Please contact support.", 401));
    }

    // Generate new tokens
    const { accessToken, refreshToken } = createTokens(user._id);
    
    // Update refresh token in database
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new auth cookies
    setAuthCookies(res, accessToken, refreshToken);

    sendSuccessResponse(res, 200, {
      accessToken,
      refreshToken
    });
  } catch (err) {
    return next(new CustomError("Invalid or expired refresh token", 401));
  }
});

/**
 * Get Current User Controller
 * @route GET /api/auth/me
 * @access Private
 */
const getCurrentUser = asyncErrorHandler(async (req, res, next) => {
  // User is already available from auth middleware
  // For /api/auth/me we just need basic identity info, not full profile
  const user = req.user;

  if (!user) {
    return next(new CustomError("Not authenticated", 401));
  }

  sendSuccessResponse(res, 200, { user });
});

/**
 * Password Reset Request Controller
 * @route POST /api/auth/forgot-password
 * @access Public
 */
const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new CustomError("No account found with this email", 404));
  }

  // Generate reset token
  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/reset-password/${resetToken}`;
  const message = `
    Password Reset Request\n
    Please use the following link to reset your password:\n
    ${resetUrl}\n
    This link will expire in 10 minutes.\n
    If you didn't request this, please ignore this email.
  `;

  try {
    // Send reset email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message: message,
    });

    sendSuccessResponse(res, 200, {
      message: "Password reset link sent to email",
    });
  } catch (err) {
    // Clear reset tokens if email fails
    user.password_reset_token = undefined;
    user.password_reset_token_expires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "Failed to send password reset email. Please try again later.",
        500
      )
    );
  }
});

/**
 * Password Reset Controller
 * @route POST /api/auth/reset-password/:token
 * @access Public
 */
const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return next(new CustomError("Password is required", 400));
  }

  // Hash token for comparison
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find valid user with token
  const user = await UserModel.findOne({
    password_reset_token: hashedToken,
    password_reset_token_expires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new CustomError("Invalid or expired reset token", 400));
  }

  // Update password and clear reset tokens
  user.password = password;
  user.password_reset_token = undefined;
  user.password_reset_token_expires = undefined;
  
  // Invalidate existing refresh tokens for security
  user.refresh_token = undefined;

  await user.save();

  // Return success without automatically logging in
  sendSuccessResponse(res, 200, {
    message: "Password reset successful. Please log in with your new password."
  });
});

module.exports = {
  signUpUser,
  signInUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
