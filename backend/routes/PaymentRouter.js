// const express = require('express');
// const { 
//     processPayment,
//     getPaymentDetails,
//     handleWebhook,
//     refundPayment
// } = require('../controllers/PaymentController');
// const { protect, restrict } = require('../middlewares/AuthMiddleware');

// const paymentRouter = express.Router();

// // Webhook route (must be before protect middleware)
// paymentRouter.post(
//     '/webhook',
//     express.raw({ type: 'application/json' }),
//     handleWebhook
// );

// // Protect all other payment routes
// paymentRouter.use(protect);

// // Payment processing routes
// paymentRouter.post('/process', processPayment);

// // Payment details route
// paymentRouter.get('/:orderId', getPaymentDetails);

// // Refund route (restricted to Admin and order owner)
// paymentRouter.post(
//     '/refund',
//     refundPayment
// );

// module.exports = paymentRouter;