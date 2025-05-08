const { 
  signUpUser, 
  signInUser, 
  forgotPassword, 
  resetPassword,
  logoutUser,
  refreshToken,
  getCurrentUser 
} = require('../controllers/AuthController');
const { protect } = require('../middlewares/AuthMiddleware');


const authRouter = require('express').Router();

// Public routes
authRouter.post("/signup", signUpUser);
authRouter.post("/signin", signInUser);
authRouter.post("/refresh-token", refreshToken);
authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", resetPassword);

// Protected routes
authRouter.use(protect);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", getCurrentUser);

module.exports = authRouter;