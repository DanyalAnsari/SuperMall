const express = require("express");
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderPayment,
  updateOrderStatus,
  getVendorOrders,
  getAllOrders,
} = require("../controllers/OrderController");
const { protect, restrict } = require("../middlewares/AuthMiddleware");
const OrderRouter = express.Router();

OrderRouter.use(protect);

OrderRouter.route("/").get(getUserOrders).post(createOrder);

OrderRouter.route("/:id").get(getOrderById);
OrderRouter.put("/:id/pay", updateOrderPayment);
OrderRouter.put("/:id/status", restrict("Admin", "Vendor"), updateOrderStatus);

OrderRouter.get("/all", restrict("Admin"), getAllOrders);
OrderRouter.get("/vendor", restrict("Vendor"), getVendorOrders);

module.exports = OrderRouter;
