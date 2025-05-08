const { UserModel } = require("../models/UserModel");
const { ProductModel } = require("../models/ProductModel");
const { ReviewsModel } = require("../models/ReviewsModel");
const { OrderModel } = require("../models/OrderModel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const ApiFeatures = require("../utils/ApiFeatures");
const { filterReqObj, sendSuccessResponse, createTokens } = require("../utils/Utilities");

/**
 * Get Current User Profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = asyncErrorHandler(async (req, res, next) => {
  // We use req.user._id since it's more reliable than req.user.id
  const user = await UserModel.findById(req.user._id);
  
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  
  sendSuccessResponse(res, 200, { user });
});

/**
 * Update Current User Profile
 * @route PUT /api/users/profile
 * @access Private
 */
const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const allowedFields = ["name", "email", "phone_number", "address"];

  // Prevent password updates through this route
  if (req.body.password) {
    return next(
      new CustomError("Use /update-password for password updates", 400)
    );
  }

  const filteredObject = filterReqObj(req.body, allowedFields);

  if (Object.keys(filteredObject).length === 0) {
    return next(new CustomError("No valid fields to update", 400));
  }

  // Use findById + save to ensure pre-save middleware runs
  const user = await UserModel.findById(req.user._id);
  
  if (!user) {
    return next(new CustomError("User not found", 404));
  }
  
  // Update fields
  Object.keys(filteredObject).forEach(field => {
    user[field] = filteredObject[field];
  });
  
  await user.save({ validateBeforeSave: true });

  sendSuccessResponse(res, 200, { user });
});

/**
 * Update User Password
 * @route PATCH /api/users/update-password
 * @access Private
 */
const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return next(new CustomError("Current and new password are required", 400));
  }

  // Get user with password field
  const user = await UserModel.findById(req.user._id).select("+password");

  // Verify current password
  if (!user || !(await user.comparePassword(currentPassword))) {
    return next(new CustomError("Current password is incorrect", 400));
  }

  // Update password
  user.password = newPassword;
  
  // Invalidate refresh tokens when password changes
  user.refresh_token = undefined;
  
  await user.save();

  // Generate new tokens
  const { accessToken, refreshToken } = createTokens(user._id);
  
  // Update refresh token in database
  user.refresh_token = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set auth cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('refresh_token', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  res.cookie('access_token', accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  });

  sendSuccessResponse(res, 200, { 
    message: "Password updated successfully",
    accessToken,
    refreshToken
  });
});

/**
 * Get All Users (Admin)
 * @route GET /api/users
 * @access Admin
 */
const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(UserModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute queries concurrently
  const [users, totalUsers] = await Promise.all([
    features.query.select('-password -refresh_token'),
    UserModel.countDocuments(features.queryObj)
  ]);

  sendSuccessResponse(res, 200, {
    users,
    pagination: {
      total: totalUsers,
      page: features.page || 1,
      limit: features.limit || 10,
      pages: Math.ceil(totalUsers / (features.limit || 10))
    }
  });
});

/**
 * Get User by ID (Admin)
 * @route GET /api/users/:id
 * @access Admin
 */
const getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id)
    .select('-password -refresh_token');
  
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  sendSuccessResponse(res, 200, { user });
});

/**
 * Update User (Admin)
 * @route PUT /api/users/:id
 * @access Admin
 */
const updateUser = asyncErrorHandler(async (req, res, next) => {
  const allowedFields = ["name", "email", "role", "phone_number", "address", "isActive"];
  const filteredObject = filterReqObj(req.body, allowedFields);

  if (Object.keys(filteredObject).length === 0) {
    return next(new CustomError("No valid fields to update", 400));
  }

  // Find user first
  const user = await UserModel.findById(req.params.id);
  
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Handle special case when deactivating a user
  if (filteredObject.isActive === false && user.isActive === true) {
    // Invalidate refresh tokens when deactivating
    user.refresh_token = undefined;
  }
  
  // Update fields
  Object.keys(filteredObject).forEach(field => {
    user[field] = filteredObject[field];
  });

  await user.save({ validateBeforeSave: true });

  sendSuccessResponse(res, 200, { 
    user,
    message: "User updated successfully" 
  });
});

/**
 * Delete User (Admin)
 * @route DELETE /api/users/:id
 * @access Admin
 */
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  // Prevent self-deletion
  if (req.user._id.toString() === req.params.id) {
    return next(new CustomError("Cannot delete your own account", 400));
  }

  const user = await UserModel.findById(req.params.id);
  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  // Check dependencies
  const [orderCount, productCount] = await Promise.all([
    OrderModel.countDocuments({ user: req.params.id }),
    user.role === "Vendor" ? ProductModel.countDocuments({ vendor: req.params.id }) : 0
  ]);

  if (orderCount > 0) {
    return next(
      new CustomError(
        "Cannot delete user with existing orders. Consider deactivating instead.",
        400
      )
    );
  }

  if (productCount > 0) {
    return next(
      new CustomError(
        "Cannot delete vendor with active products. Deactivate or transfer products first.",
        400
      )
    );
  }

  // Delete user and related data
  await Promise.all([
    UserModel.findByIdAndDelete(req.params.id),
    ReviewsModel.deleteMany({ user: req.params.id })
  ]);

  sendSuccessResponse(res, 200, {
    message: "User and related data deleted successfully"
  });
});

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
