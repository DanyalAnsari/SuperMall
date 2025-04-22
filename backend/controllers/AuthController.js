const { UserModel } = require("../models/UserModel");
const {
  sendSuccessResponse,
  sendAuthSuccessResponse,
} = require("../utils/Utilities");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const sendEmail = require("../utils/Email");
const crypto = require("crypto");

/**
 * User Registration Controller
 * @route POST /api/auth/signup
 * @access Public
 */
const signUpUser = asyncErrorHandler(async (req, res, next) => {
  // Prevent role escalation
  if (req.body.role === "Admin" && req.user.role !== "Superadmin") {
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

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  sendAuthSuccessResponse(res, 200, userResponse);
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

  await user.save();

  sendAuthSuccessResponse(res, 200, {
    message: "Password reset successful",
  });
});

module.exports = {
  signUpUser,
  signInUser,
  forgotPassword,
  resetPassword,
};
