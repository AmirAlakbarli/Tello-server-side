const GlobalError = require("../errors/GlobalError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const asyncCatch = require("../utils/asyncCatch");
const User = require("../models/user");
const Basket = require("../models/basket");

const privateRoute = asyncCatch(async (req, res, next) => {
  let token;

  //! Check if user send Header Auth
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new GlobalError("There isn't token!"));

  //! Check if token is valid
  const verifyPromise = promisify(jwt.verify);
  const info = await verifyPromise(token, process.env.JWT_SIGNATURE);
  if (!info) return next(new GlobalError("Token isn't valid or isn't sent"));

  //! Check if token contain userId or basketId
  if (info.userId) {
    const user = await User.findById(info.userId);
    req.user = user;
  } else if (info.basketId) {
    const basket = await Basket.findById(info.basketId);
    req.basket = basket;
  }
  next();
});

const access = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(
        new GlobalError("You haven't permission for this operation", 403)
      );
    }
    next();
  };
};

module.exports = { privateRoute, access };
