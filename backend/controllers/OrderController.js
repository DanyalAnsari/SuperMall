const { CartModel } = require("../models/CartModel");
const { OrderModel } = require("../models/OrderModel");
const { ProductModel } = require("../models/ProductModel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { sendSuccessResponse } = require("../utils/Utilities");
const ApiFeatures = require("../utils/ApiFeatures");

const createOrder = asyncErrorHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await CartModel.findOne({ user: req.user.id })
    .populate("items.product", "name price stock vendor");

  if (!cart?.items?.length) {
    return next(new CustomError("Cart is empty", 400));
  }

  // Validate stock and prepare order items
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    if (!item.product) {
      return next(new CustomError(`Product not found in cart`, 400));
    }

    if (item.product.stock < item.quantity) {
      return next(new CustomError(
        `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}`,
        400
      ));
    }

    orderItems.push({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
      name: item.product.name,
      vendor: item.product.vendor
    });

    totalAmount += item.quantity * item.product.price;
  }

  const tax = Number(process.env.TAX) || 0.1;
  const shippingThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD) || 50;
  const standardShipping = Number(process.env.STANDARD_SHIPPING) || 5.99;

  const order = await OrderModel.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    taxAmount: Number((totalAmount * tax).toFixed(2)),
    shippingAmount: totalAmount < shippingThreshold ? standardShipping : 0
  });

  // Update product stocks and delete cart concurrently
  await Promise.all([
    ...orderItems.map(item => 
      ProductModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      })
    ),
    CartModel.findOneAndDelete({ user: req.user.id })
  ]);

  await order.populate([
    { path: "items.product", select: "name images" },
    { path: "user", select: "name email" }
  ]);

  sendSuccessResponse(res, 201, {
    message: "Order created successfully",
    order
  });
});

const getUserOrders = asyncErrorHandler(async (req, res, next) => {
  // const orders = await OrderModel.find({ user: req.user.id })
  // .sort({ createdAt: -1 })

  const features = new ApiFeatures(
    OrderModel.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [orders, totalOrders] = await Promise.all([
    features.query
      .populate("category", "name")
      .populate("items.product", "name images"),
    OrderModel.countDocuments(features.queryObj),
  ]);

  sendSuccessResponse(res, 200, {
    pagination: {
      total: totalOrders,
      page: features.page || 1,
      pages: Math.ceil(totalOrders / features.limit || 10),
    },
    orders,
  });

  res.json(orders);
});

const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)
    .populate("items.product", "name images price")
    .populate("user", "name email");

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  // Check if user has permission to view order
  if (order.user._id.toString() !== req.user.id && req.user.role !== "Admin") {
    return next(new CustomError("Unauthorized to view this order", 403));
  }

  sendSuccessResponse(res, 200, { order });
});

const updateOrderPayment = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { paymentResult, status } = req.body;

  const order = await OrderModel.findById(id);

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  // Validate user's permission
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new CustomError("Unauthorized to update this order", 403));
  }

  order.paymentStatus = status || "Paid";
  order.paymentResult = paymentResult;
  order.isPaid = true;
  order.paidAt = Date.now();

  await order.save();
  sendSuccessResponse(res, 200, {
    message: "Payment updated successfully",
    order,
  });
});

const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];
  
  if (!validStatuses.includes(status)) {
    return next(new CustomError(`Invalid status. Must be one of: ${validStatuses.join(", ")}`, 400));
  }

  const order = await OrderModel.findById(id);

  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  // Check permissions
  const isVendorOrder = order.items.some(
    item => item.vendor.toString() === req.user.id
  );

  if (req.user.role !== "Admin" && !isVendorOrder) {
    return next(new CustomError("Unauthorized to update this order", 403));
  }

  // Prevent status regression
  const statusIndex = validStatuses.indexOf(status);
  const currentStatusIndex = validStatuses.indexOf(order.status);

  if (statusIndex < currentStatusIndex && status !== "Canceled") {
    return next(new CustomError("Cannot revert order to previous status", 400));
  }

  order.status = status;

  if (status === "Delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  if (status === "Canceled" && order.status === "Delivered") {
    return next(new CustomError("Cannot cancel delivered order", 400));
  }

  await order.save();

  await order.populate([
    { path: "items.product", select: "name images" },
    { path: "user", select: "name email" }
  ]);

  sendSuccessResponse(res, 200, {
    message: "Order status updated successfully",
    order
  });
});

const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(OrderModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [orders, totalOrders] = await Promise.all([
    features
      .find()
      .populate("user", "name email")
      .populate("items.product", "name"),
    OrderModel.countDocuments(features.queryObj),
  ]);

  sendSuccessResponse(res, 200, {
    pagination: {
      total: totalOrders,
      page: features.page || 1,
      pages: Math.ceil(totalOrders / features.limit || 10),
    },
    orders,
  });
});

const getVendorOrders = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(OrderModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [vendorOrders, totalOrders] = await Promise.all([
    features
      .find({
        "items.vendor": req.user.id,
      })
      .populate("user", "name email")
      .populate("items.product", "name"),
    OrderModel.countDocuments({
      ...features.queryObj,
      "items.vendor": req.user.id,
    }),
  ]);

  sendSuccessResponse(res, 200, {
    pagination: {
      total: vendorOrders,
      page: features.page || 1,
      pages: Math.ceil(totalOrders / features.limit || 10),
    },
    vendorOrders,
  });
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderPayment,
  updateOrderStatus,
  getAllOrders,
  getVendorOrders
};