const mongoose = require("mongoose");
const validators = require("../utils/validators");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      validate: {
        validator: validators.isValidObjectId,
        message: "Invalid user ID format"
      }
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
          validate: {
            validator: validators.isValidObjectId,
            message: "Invalid product ID format"
          }
        },
        quantity: { 
          type: Number, 
          required: [true, "Quantity is required"],
          min: [1, "Quantity must be at least 1"],
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
          trim: true
        },
        image: { 
          type: String,
          validate: {
            validator: validators.isValidURL,
            message: "Please provide valid image URL"
          }
        }
      }
    ],
    expiresAt: { 
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value > new Date();
        },
        message: "Expiration date must be in the future"
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for total cart value
CartSchema.virtual('totalValue').get(function() {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const CartModel = mongoose.models.Cart || mongoose.model("Carts", CartSchema);

module.exports = { CartModel };
