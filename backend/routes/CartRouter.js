const express = require("express");
const { protect } = require("../middlewares/AuthMiddleware");
const {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/CartController");

const cartRouter = express.Router();

// Protect all cart routes
cartRouter.use(protect);

// Cart management routes
cartRouter
  .route("/")
  .get(getUserCart)
  .post(addToCart)
  .put(updateCartItem)
  .delete(clearCart);

// Individual cart item routes
cartRouter.delete("/item/:productId", removeFromCart);

module.exports = cartRouter;
