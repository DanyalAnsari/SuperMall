const mongoose = require("mongoose");
const validators = require("../utils/validators");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

/**
 * Address Schema for user's location information
 */
const AddressSchema = new mongoose.Schema({
  street: {
    type: String,
    trim: true,
    required: [true, "Street address is required"]
  },
  city: {
    type: String,
    required: [true, "City is required"],
    validate: validators.getNameValidation("City")
  },
  state: {
    type: String,
    required: [true, "State is required"],
    validate: validators.getNameValidation("State")
  },
  zip: {
    type: String,
    required: [true, "ZIP code is required"],
    validate: {
      validator: validators.isZipCode,
      message: "Please enter a valid ZIP code"
    }
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    validate: validators.getNameValidation("Country")
  }
}, { _id: false });

/**
 * Main User Schema
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: validators.getNameValidation("Name")
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      index: true,
      trim: true, 
      lowercase: true,
      validate: [validators.isEmail, "Please enter a valid email"]
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false // Don't return password in queries
    },
    role: {
      type: String,
      enum: {
        values: ["Customer", "Vendor", "Admin", "Superadmin"],
        message: "Invalid role specified"
      },
      default: "Customer"
    },
    phone_number: {
      type: String,
      required: [true, "Please enter your phone number"],
      validate: [validators.isPhone, "Please enter a valid phone number"]
    },
    address: AddressSchema,
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    avatar: {
      type: String,
      validate: {
        validator: validators.isValidURL,
        message: "Please provide valid image URL"
      }
    },
    password_reset_token: String,
    password_reset_token_expires: Date
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * Indexes for better query performance
 */
UserSchema.index({ role: 1 });

/**
 * Hash password before saving
 */
UserSchema.pre("save", async function(next) {
  // Only hash password if it was modified
  if (!this.isModified("password")) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance Methods
 */
UserSchema.methods = {
  // Create password reset token
  createResetPasswordToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    this.password_reset_token = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.password_reset_token_expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
  },

  // Compare password for login
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  },

  // Check if password was changed after JWT was issued
  async isPasswordChanged(JWTTimestamp) {
    if (!this.updatedAt) return false;
    
    const passwordChangeTime = parseInt(this.updatedAt.getTime() / 1000, 10);
    return passwordChangeTime > JWTTimestamp;
  }
};

/**
 * Virtual Fields
 */
UserSchema.virtual('fullAddress').get(function() {
  if (!this.address) return '';
  
  return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zip}, ${this.address.country}`;
});

const UserModel = mongoose.models.users || mongoose.model("users", UserSchema);

module.exports = { UserModel };
