const mongoose = require("mongoose");
const validators = require("../utils/validators");

const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
      unique: true,
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid order ID format"
      }
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid user ID format"
      }
    },
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      validate: {
        validator: validators.isPositiveNumber,
        message: "Amount must be greater than 0"
      }
    },
    method: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["Credit Card", "Debit Card", "PayPal", "Bank Transfer"],
        message: "Invalid payment method"
      }
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed", "Failed", "Refunded"],
        message: "Invalid payment status"
      },
      default: "Pending"
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true,
      unique: true
    },
    paymentGatewayResponse: {
      type: Object,
      select: false // Hide in normal queries
    },
    refundReason: {
      type: String,
      trim: true,
      maxlength: [500, "Refund reason cannot exceed 500 characters"]
    },
    refundedAt: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value <= new Date();
        },
        message: "Refund date cannot be in the future"
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ order: 1 }, { unique: true });

// Pre-save middleware to handle refund date
PaymentSchema.pre('save', function(next) {
  if (this.status === 'Refunded' && !this.refundedAt) {
    this.refundedAt = new Date();
  }
  next();
});

// Virtual for formatted amount
PaymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.amount);
});

const PaymentModel = mongoose.models.Payments || mongoose.model("Payments", PaymentSchema);

module.exports = { PaymentModel };
