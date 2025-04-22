const { signUpUser, signInUser, forgotPassword, resetPassword } = require('../controllers/AuthController');
const { protect } = require('../middlewares/AuthMiddleware');


const authRouter=require('express').Router()

authRouter.post("/signup", signUpUser);
authRouter.post("/signin", signInUser);
authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", protect, resetPassword);

module.exports=authRouter