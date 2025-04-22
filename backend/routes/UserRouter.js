const { protect, restrict } = require("../middlewares/AuthMiddleware");
const userRouter = require("express").Router();
const {
  updatePassword,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

userRouter.use(protect);

userRouter.get("/profile", getProfile);
userRouter.put("/profile", updateProfile);
userRouter.patch("/update-password", updatePassword);

userRouter.use(restrict("Admin"));

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
