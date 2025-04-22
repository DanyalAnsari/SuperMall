const { OrderModel } = require("../models/OrderModel");
const { PaymentModel } = require("../models/PaymentModel");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const { sendSuccessResponse } = require("../utils/Utilities");

const processPayment = asyncErrorHandler(async (req, res, next) => {
  const { orderId, paymentMethod, paymentToken } = req.body;
  const userId = req.user.id;

  const order = await OrderModel.findById(orderId);
  if (!order) {
    return next(new CustomError("Order not found", 404));
  }

  if (order.user.toString() !== userId) {
    return next(new CustomError("Unauthorized to process this order", 403));
  }

  const existingPayment = await PaymentModel.findOne({ 
    order: orderId,
    status: { $in: ["Completed", "Processing"] }
  });
  
  if (existingPayment) {
    return next(new CustomError(
      `Order payment already ${existingPayment.status.toLowerCase()}`, 
      400
    ));
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: "usd",
      payment_method: paymentToken,
      confirm: true,
      metadata: {
        orderId: orderId,
        userId: userId
      }
    });

    const payment = await PaymentModel.create({
      order: orderId,
      user: userId,
      amount: order.totalAmount,
      method: paymentMethod,
      status: "Completed",
      transactionId: paymentIntent.id,
      paymentGatewayResponse: paymentIntent
    });

    // Update order status
    await OrderModel.findByIdAndUpdate(orderId, {
      paymentStatus: "Paid",
      status: "Processing",
      paymentResult: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        updateTime: new Date(),
        emailAddress: req.user.email
      }
    });

    sendSuccessResponse(res, 200, {
      message: "Payment processed successfully",
      payment: {
        id: payment._id,
        orderId: payment.order,
        amount: payment.formattedAmount,
        status: payment.status
      }
    });
  } catch (error) {
    // Handle Stripe errors
    return next(new CustomError(
      error.message || "Payment processing failed",
      error.statusCode || 400
    ));
  }
});

const getPaymentDetails = asyncErrorHandler(async (req, res, next) => {
  const { orderId } = req.params;
  const userId = req.user.id;

  const payment = await PaymentModel.findOne({ order: orderId })
    .populate("order", "totalAmount status")
    .populate("user", "name email");

  if (!payment) {
    return next(new CustomError("Payment not found", 404));
  }

  const isAuthorized = 
    payment.user._id.toString() === userId || 
    req.user.role === "Admin";

  if (!isAuthorized) {
    return next(new CustomError("Unauthorized access", 403));
  }

  sendSuccessResponse(res, 200, {
    payment: {
      id: payment._id,
      orderId: payment.order._id,
      amount: payment.formattedAmount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      createdAt: payment.createdAt,
      orderDetails: {
        totalAmount: payment.order.totalAmount,
        orderStatus: payment.order.status
      }
    }
  });
});

const handleWebhook = asyncErrorHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return next(new CustomError(`Webhook Error: ${err.message}`, 400));
  }

  const handlers = {
    'payment_intent.succeeded': handleSuccessfulPayment,
    'payment_intent.payment_failed': handleFailedPayment,
    'charge.refunded': handleRefundedPayment
  };

  const handler = handlers[event.type];
  if (handler) {
    try {
      await handler(event.data.object);
    } catch (error) {
      console.error(`Error handling ${event.type}:`, error);
    }
  }

  res.json({ received: true });
});

const refundPayment = asyncErrorHandler(async (req, res, next) => {
  const { orderId, reason } = req.body;
  const userId = req.user.id;

  const payment = await PaymentModel.findOne({ order: orderId });
  if (!payment) {
    return next(new CustomError("Payment not found", 404));
  }

  if (payment.status === "Refunded") {
    return next(new CustomError("Payment already refunded", 400));
  }

  const order = await OrderModel.findById(orderId);
  const isAuthorized = 
    req.user.role === "Admin" || 
    order.user.toString() === userId;

  if (!isAuthorized) {
    return next(new CustomError("Unauthorized to refund", 403));
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment.transactionId,
      amount: Math.round(payment.amount * 100)
    });

    payment.status = "Refunded";
    payment.refundReason = reason;
    payment.refundedAt = new Date();
    await payment.save();

    await OrderModel.findByIdAndUpdate(orderId, {
      status: "Canceled",
      paymentStatus: "Refunded"
    });

    sendSuccessResponse(res, 200, {
      message: "Payment refunded successfully",
      refundId: refund.id
    });
  } catch (error) {
    return next(new CustomError(
      error.message || "Refund processing failed",
      error.statusCode || 400
    ));
  }
});

// Helper functions
async function handleSuccessfulPayment(paymentIntent) {
  const { orderId } = paymentIntent.metadata;
  await Promise.all([
    PaymentModel.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      { status: "Completed" }
    ),
    OrderModel.findByIdAndUpdate(orderId, {
      status: "Processing",
      paymentStatus: "Paid"
    })
  ]);
}

async function handleFailedPayment(paymentIntent) {
  const { orderId } = paymentIntent.metadata;
  await Promise.all([
    PaymentModel.findOneAndUpdate(
      { transactionId: paymentIntent.id },
      { status: "Failed" }
    ),
    OrderModel.findByIdAndUpdate(orderId, {
      status: "Canceled",
      paymentStatus: "Failed"
    })
  ]);
}

async function handleRefundedPayment(charge) {
  const payment = await PaymentModel.findOne({ 
    transactionId: charge.payment_intent 
  });
  
  if (payment) {
    payment.status = "Refunded";
    payment.refundedAt = new Date();
    await payment.save();

    await OrderModel.findByIdAndUpdate(payment.order, {
      status: "Canceled",
      paymentStatus: "Refunded"
    });
  }
}

module.exports = {
  processPayment,
  getPaymentDetails,
  handleWebhook,
  refundPayment
};
