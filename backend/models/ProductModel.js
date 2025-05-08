const mongoose = require("mongoose");
const validators = require("../utils/validators");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter the product name.'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
      validate: validators.getProductNameValidation("Product name")
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Please enter product description.'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Provide product price.'],
      validate: {
        validator: validators.isPositiveNumber,
        message: "Price must be greater than 0"
      }
    },
    discountedPrice: {
      type: Number
    },
    stock: {
      type: Number,
      required: [true, 'Provide product stock in numbers.'],
      validate: {
        validator: validators.isNonNegativeInteger,
        message: "Stock must be a non-negative integer"
      }
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, 'Please select a category.'],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid category ID format"
      }
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid vendor ID format"
      }
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
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"]
      },
      count: {
        type: Number,
        default: 0
      }
    },
    tags: [{
      type: String,
      trim: true
    }],
    specifications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      value: {
        type: String,
        required: true,
        trim: true
      }
    }],
    featured:{
      type:Boolean,
      default:false
    },
    bestseller:{
      type:Boolean,
      default:false
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, vendor: 1 });
ProductSchema.index({ price: 1 });

// Generate slug from name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for checking if product is in stock
ProductSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function() {
  if (this.discountedPrice) {
    return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
  }
  return 0;
});

// Static method to update average rating
ProductSchema.statics.updateRating = async function(productId, rating) {
  const stats = await this.aggregate([
    { $match: { _id: productId } },
    {
      $set: {
        'ratings.average': { $avg: '$ratings' },
        'ratings.count': { $sum: 1 }
      }
    }
  ]);

  await this.findByIdAndUpdate(productId, {
    'ratings.average': stats[0]?.ratings.average || 0,
    'ratings.count': stats[0]?.ratings.count || 0
  });
};

const ProductModel = mongoose.models.Products || mongoose.model("Products", ProductSchema);

module.exports = { ProductModel };
