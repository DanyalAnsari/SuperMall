const { CartModel } = require("../models/CartModel");
const { ProductModel } = require("../models/ProductModel");
const asyncErrorhandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { sendSuccessResponse } = require("../utils/Utilities");

const getUserCart = asyncErrorhandler(async (req, res, next) => {
  // Find cart for current user or create new empty cart
  let cart = await CartModel.findOne({ user: req.user.id })
    .populate({
      path: "items.product",
      select: "name price images stock"
    });

  if (!cart) {
    cart = await CartModel.create({
      user: req.user.id,
      items: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
    });
  }

  // Use virtual field for total
  const totalValue = cart.totalValue;
  
  sendSuccessResponse(res, 200, { cart, totalValue });
});

const addToCart = asyncErrorhandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return next(new CustomError("Product ID is required", 400));
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  if (product.stock < quantity) {
    return next(new CustomError("Not enough stock available", 400));
  }

  let cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    cart = new CartModel({
      user: req.user.id,
      items: [],
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  }

  const existingItemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Update existing item
    const newQuantity = cart.items[existingItemIndex].quantity + quantity;
    
    if (newQuantity > product.stock) {
      return next(new CustomError("Requested quantity exceeds available stock", 400));
    }
    
    cart.items[existingItemIndex].quantity = newQuantity;
    cart.items[existingItemIndex].price = product.price; // Update price
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      name: product.name,
      image: product.images[0] // Assuming first image is main
    });
  }

  await cart.save();

  // Populate product details and calculate total
  await cart.populate({
    path: "items.product",
    select: "name price images stock"
  });

  const totalValue = cart.totalValue;

  sendSuccessResponse(res, 201, { cart, totalValue });
});

const removeFromCart = asyncErrorhandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    returnnext(new CustomError("Product ID is required", 400));
  }

  // Find user's cart
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  }

  // Find and remove item
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new CustomError("Item not found in cart", 404));
  }

  // Remove item
  cart.items.splice(itemIndex, 1);

  // Save updated cart
  await cart.save();

  // Populate product details
  await cart.populate({
    path: "items.product",
    select: "stock",
  });

  sendSuccessResponse(res, 200, { cart });
});

const updateCartItem = asyncErrorhandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return next(new CustomError("Product ID and quantity are required", 400));
  }

  if (quantity < 0) {
    return next(new CustomError("Quantity cannot be negative", 400));
  }

  const product = await ProductModel.findById(productId);
  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  if (quantity > product.stock) {
    return next(new CustomError("Requested quantity exceeds available stock", 400));
  }

  const cart = await CartModel.findOne({ user: req.user.id });
  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new CustomError("Item not found in cart", 404));
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;
  }

  await cart.save();
  await cart.populate({
    path: "items.product",
    select: "name price images stock"
  });

  const totalValue = cart.totalValue;

  sendSuccessResponse(res, 200, { cart, totalValue });
});

const clearCart = asyncErrorhandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user.id });

  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  }

  // Clear items
  cart.items = [];

  // Save updated cart
  await cart.save();

  sendSuccessResponse(res, 200, { cart });
});

module.exports = {
  getUserCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
