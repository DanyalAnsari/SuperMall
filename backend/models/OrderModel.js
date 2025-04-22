const mongoose = require("mongoose");
const validators = require("../utils/validators");

// Order Item Schema
const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product reference is required"],
    validate: {
      validator: validators.isValidObjectId,
      message: "Invalid product ID format"
    }
  },
  quantity: { 
    type: Number, 
    required: [true, "Quantity is required"],
    validate: {
      validator: validators.isPositiveNumber,
      message: "Quantity must be greater than 0"
    }
  },
  price: { 
    type: Number, 
    required: [true, "Price is required"],
    validate: {
      validator: validators.isPositiveNumber,
      message: "Price must be greater than 0"
    }
  },
  name: { 
    type: String, 
    required: [true, "Product name is required"],
    trim: true,
    minlength: [3, "Product name must be at least 3 characters"],
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },
  vendor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: [true, "Vendor reference is required"],
    validate: {
      validator: validators.isValidObjectId,
      message: "Invalid vendor ID format"
    }
  }
});

const OrderSchema = new mongoose.Schema(
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
    items: {
      type: [OrderItemSchema],
      required: [true, "Order must contain at least one item"],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item"
      }
    },
    shippingAddress: {
      street: { 
        type: String, 
        required: [true, "Street address is required"],
        trim: true,
        maxlength: [100, "Street address cannot exceed 100 characters"]
      },
      city: { 
        type: String, 
        required: [true, "City is required"],
        trim: true,
        validate: validators.getNameValidation("City")
      },
      state: { 
        type: String, 
        required: [true, "State is required"],
        trim: true,
        validate: validators.getNameValidation("State")
      },
      zipCode: { 
        type: String, 
        required: [true, "ZIP code is required"],
        validate: {
          validator: validators.isZipCode,
          message: "Invalid ZIP code format"
        }
      },
      country: { 
        type: String, 
        required: [true, "Country is required"],
        trim: true,
        validate: validators.getNameValidation("Country")
      }
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: [true, "Payment reference is required"],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid payment ID format"
      }
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Processing", "Shipped", "Delivered", "Canceled"],
        message: "Invalid order status"
      },
      default: "Pending"
    },
    totalAmount: { 
      type: Number, 
      required: [true, "Total amount is required"],
      validate: {
        validator: validators.isPositiveNumber,
        message: "Total amount must be greater than 0"
      }
    },
    taxAmount: { 
      type: Number, 
      required: true, 
      default: 0,
      min: [0, "Tax amount cannot be negative"]
    },
    shippingAmount: { 
      type: Number, 
      required: true, 
      default: 0,
      min: [0, "Shipping amount cannot be negative"]
    },
    isDelivered: { 
      type: Boolean, 
      default: false 
    },
    deliveredAt: { 
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value <= new Date();
        },
        message: "Delivery date cannot be in the future"
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total order value including tax and shipping
OrderSchema.virtual('grandTotal').get(function() {
  return this.totalAmount + this.taxAmount + this.shippingAmount;
});

// Pre-save middleware to validate delivery date
OrderSchema.pre('save', function(next) {
  if (this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }
  next();
});

const OrderModel = mongoose.models.Orders || mongoose.model("Orders", OrderSchema);

module.exports = { OrderModel };
