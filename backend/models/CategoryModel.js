const mongoose = require("mongoose");
const validators = require("../utils/validators");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required."],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
      validate: validators.getCategoryNameValidation("Category name")
    },
    description: { 
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"]
    },
    image: { 
      type: String,
      validate: {
        validator: validators.isValidURL,
        message: "Please provide valid image URL"
      }
    },
    parent_category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid parent category ID"
      }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      // index: true
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create slug before saving
CategorySchema.pre('save', async function (next) {
  // Generate slug only if the name is modified or slug is not set
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/-+/g, '-')        // Replace multiple hyphens with a single hyphen
      .replace(/^-|-$/g, '');     // Remove leading or trailing hyphens

    // Check for duplicate slugs
    const existingCategory = await this.constructor.findOne({ slug: this.slug });
    if (existingCategory && existingCategory._id.toString() !== this._id.toString()) {
      return next(new Error('Slug must be unique'));
    }
  }

  next();
});

// Virtual for sub-categories
CategorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent_category'
});

// Ensure parent category exists if specified
CategorySchema.pre('save', async function(next) {
  if (this.parent_category) {
    const parentExists = await this.constructor.findById(this.parent_category);
    if (!parentExists) {
      return next(new Error('Parent category does not exist'));
    }
  }
  next();
});

const CategoryModel = mongoose.models.Categories || mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel };
