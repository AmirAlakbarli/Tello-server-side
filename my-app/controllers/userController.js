const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const User = require("../models/user");
const Basket = require("../models/basket");
const { deleteOne } = require("../utils/factory");

exports.getUser = asyncCatch(async (req, res, next) => {
  const oneUser = await User.findOne({ _id: req.user._id });
  if (!oneUser) return next(new GlobalError("Invalid id: User not found"));
  res.status(200).json({
    success: true,
    data: { user: oneUser },
  });
});

exports.updateUser = asyncCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  });

  if (!user)
    return next(new GlobalError("Cannot change account information!", 500));
  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

exports.deleteUser = asyncCatch(async (req, res, next) => {
  const userId = req.user._id;
  const deletedUser = await User.findByIdAndDelete(userId);
  const deletedBasket = await Basket.findOneAndDelete({ userId });
  if (!deletedUser) next(new GlobalError("Cannot delete account", 500));
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
