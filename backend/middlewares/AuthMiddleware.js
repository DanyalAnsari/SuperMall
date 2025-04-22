const asyncErrorHanndler = require("../utils/AsyncErrorHandler");
const util = require("util");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/UserModel");
const CustomError = require("../utils/CustomError");

const restrict = (...role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    console.log(userRole, role);
    
    if (![...role,"Superadmin"].includes(userRole)) {
      const error = new CustomError(
        "You are not authorize to perform this action",
        403
      );
      return next(error);
    }
    next();
  };
};

const protect = asyncErrorHanndler(async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
    
  if (!token) {
    return next(new CustomError("Authentication required! please login to continue.", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  const user = await UserModel.findById(decodedToken.id);

  if (!user) {
    return next(
      new CustomError("User does not exist with the given token!", 401)
    );
  }
  if (await user.isPasswordChanged(decodedToken.iat)) {
    const error = new CustomError(
      "The password is recently changed. Plase login again!",
      401
    );
    return next(error);
  }
  req.user = user;

  next();
});



module.exports = { protect, restrict };
