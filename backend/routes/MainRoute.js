const userRouter = require("./UserRouter");
const authRouter = require("./AuthRouter");
const categoryRouter = require("./CategoryRoute");
const productRouter = require("./ProductRouter");
const cartRouter=require('./CartRouter');
const OrderRouter = require("./OrderRouter");
const paymentRouter = require("./PaymentRouter");
const router=require('express').Router()

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/category", categoryRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.use('/orders', OrderRouter )
// router.use('/payment', paymentRouter)

module.exports=router