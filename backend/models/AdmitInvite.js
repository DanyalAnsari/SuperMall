const mongoose = require('mongoose');
const validators = require("../utils/validators");

const AdminInviteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add a valid email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validators.isEmail, 'Please add a valid email']
  },
  token: {
    type: String,
    required: [true, 'Token is required'],
    unique: true
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator reference is required'],
    validate: {
      validator: validators.isValidObjectId,
      message: "Invalid user ID format"
    }
  },
  used: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Hash password before saving
 */
UserSchema.pre("save", function(next) {
  // Only hash password if it was modified
  if (!this.isModified("token")) return next();
  
  try {
        // Create invitation token (expires in 10 minutes)
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    next();
  } catch (error) {
    next(error);
  }
});

const AdminInviteModel = mongoose.models.AdminInvite || mongoose.model('AdminInvite', AdminInviteSchema);

module.exports = { AdminInviteModel };