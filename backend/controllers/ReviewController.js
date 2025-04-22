const { ReviewsModel } = require("../models/ReviewsModel");
const { ProductModel } = require("../models/ProductModel");
const { OrderModel } = require("../models/OrderModel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const ApiFeatures = require("../utils/ApiFeatures");
const { sendSuccessResponse } = require("../utils/ResponseHandler");

const createReview = asyncErrorHandler(async (req, res, next) => {
  const { rating, title, comment, images } = req.body;
  const { id: productId } = req.params;
  const userId = req.user.id;

  // Check if product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // Check if user already reviewed
  const existingReview = await ReviewsModel.findOne({
    user: userId,
    product: productId
  });

  if (existingReview) {
    return next(new CustomError("You have already reviewed this product", 400));
  }

  // Verify purchase
  const verifiedPurchase = await OrderModel.findOne({
    user: userId,
    'items.product': productId,
    status: 'Delivered'
  });

  const review = await ReviewsModel.create({
    user: userId,
    product: productId,
    rating,
    title,
    comment,
    images,
    isVerifiedPurchase: !!verifiedPurchase
  });

  await review.populate([
    { path: 'user', select: 'name avatar' },
    { path: 'product', select: 'name images' }
  ]);

  sendSuccessResponse(res, 201, { review });
});

const getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const { id: productId } = req.params;

  // Check if product exists
  const product = await ProductModel.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  const features = new ApiFeatures(
    ReviewsModel.find({ 
      product: productId,
      isActive: true 
    }), 
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [reviews, totalReviews] = await Promise.all([
    features.query.populate('user', 'name avatar'),
    ReviewsModel.countDocuments({ 
      product: productId,
      isActive: true 
    })
  ]);

  sendSuccessResponse(res, 200, {
    pagination: {
      total: totalReviews,
      page: features.page || 1,
      pages: Math.ceil(totalReviews / (features.limit || 10))
    },
    reviews
  });
});

const updateReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { rating, title, comment, images } = req.body;

  const review = await ReviewsModel.findById(id);
  if (!review) {
    return next(new CustomError("Review not found", 404));
  }

  // Check ownership
  if (review.user.toString() !== req.user.id) {
    return next(new CustomError("Not authorized to update this review", 403));
  }

  // Update fields
  review.rating = rating || review.rating;
  review.title = title || review.title;
  review.comment = comment || review.comment;
  review.images = images || review.images;
  
  await review.save();
  await review.populate('user', 'name avatar');

  sendSuccessResponse(res, 200, { review });
});

const deleteReview = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await ReviewsModel.findById(id);
  if (!review) {
    return next(new CustomError("Review not found", 404));
  }

  // Check authorization
  const isAuthorized = 
    review.user.toString() === req.user.id || 
    req.user.role === "Admin";

  if (!isAuthorized) {
    return next(new CustomError("Not authorized to delete this review", 403));
  }

  await review.remove();

  sendSuccessResponse(res, 200, {
    message: "Review deleted successfully"
  });
});

const toggleHelpful = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const review = await ReviewsModel.findById(id);
  if (!review) {
    return next(new CustomError("Review not found", 404));
  }

  // Check if user is trying to mark their own review
  if (review.user.toString() === userId) {
    return next(new CustomError("Cannot mark your own review as helpful", 400));
  }

  const userIndex = review.helpful.users.indexOf(userId);
  
  if (userIndex === -1) {
    // Add user to helpful
    review.helpful.users.push(userId);
    review.helpful.count += 1;
  } else {
    // Remove user from helpful
    review.helpful.users.splice(userIndex, 1);
    review.helpful.count -= 1;
  }

  await review.save();
  await review.populate('user', 'name avatar');

  sendSuccessResponse(res, 200, { review });
});

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleHelpful
};