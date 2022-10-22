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

  //! Check if toke is valid
  const verifyPromise = promisify(jwt.verify);
  const info = await verifyPromise(token, process.env.JWT_SIGNATURE);

  //! Check if user with sent token is exist
  const user = await User.findById(info.id);
  //! Check if basket with sent token is exist
  const basket = await Basket.findById(info.id);
  if (!user && !basket) return next(new GlobalError("Token isn't exist", 403));
  if (user) req.user = user;
  if (basket) req.basket = basket;
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
