const mongoose = require("mongoose");
const validators = require("../utils/validators");

const ReviewSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User reference is required"],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid user ID format"
      }
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid product ID format"
      }
    },
    rating: { 
      type: Number, 
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"]
    },
    title: { 
      type: String,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"]
    },
    comment: { 
      type: String, 
      required: [true, "Review comment is required"],
      trim: true,
      minlength: [10, "Comment must be at least 10 characters long"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"]
    },
    isVerifiedPurchase: { 
      type: Boolean, 
      default: false 
    },
    helpful: {
      count: { 
        type: Number, 
        default: 0,
        min: [0, "Helpful count cannot be negative"]
      },
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }]
    },
    images: [{
      type: String,
      validate: {
        validator: validators.isValidURL,
        message: "Please provide valid image URL"
      }
    }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound index to prevent multiple reviews from same user on same product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Index for faster queries
ReviewSchema.index({ product: 1, createdAt: -1 });

// Virtual for time since review
ReviewSchema.virtual('timeSince').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Static method to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId, isActive: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].numReviews
    });
  }
};

// Update product rating after review changes
ReviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.product);
});

ReviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.product);
});

const ReviewsModel = mongoose.models.Reviews || mongoose.model("Reviews", ReviewSchema);

module.exports = { ReviewsModel };
