const { UserModel } = require("../models/UserModel");
const { ProductModel } = require("../models/ProductModel");
const { ReviewsModel } = require("../models/ReviewsModel");
const { OrderModel } = require("../models/OrderModel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const ApiFeatures = require("../utils/ApiFeatures");
const { filterReqObj, sendSuccessResponse } = require("../utils/Utilities");

/**
 * Get Current User Profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = asyncErrorHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);
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

  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    filteredObject,
    {
      new: true,
      runValidators: true
    }
  );

  sendSuccessResponse(res, 200, { user });
});

/**
 * Update User Password
 * @route PUT /api/users/update-password
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
  await user.save();

  sendSuccessResponse(res, 200, { message: "Password updated successfully" });
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
    features.query.select('-password'),
    UserModel.countDocuments(features.queryObj)
  ]);

  sendSuccessResponse(res, 200, {
    users,
    pagination: {
      total: totalUsers,
      page: features.page || 1,
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
  const user = await UserModel.findById(req.params.id).select('-password');
  
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

  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    filteredObject,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    return next(new CustomError("User not found", 404));
  }

  sendSuccessResponse(res, 200, { user });
});

/**
 * Delete User (Admin)
 * @route DELETE /api/users/:id
 * @access Admin
 */
const deleteUser = asyncErrorHandler(async (req, res, next) => {
  // Prevent self-deletion
  if (req.user.id === req.params.id) {
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
