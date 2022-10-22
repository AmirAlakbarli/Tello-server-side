const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const User = require("../models/user");
const { deleteOne } = require("../utils/factory");

exports.getUser = asyncCatch(async (req, res, next) => {
  const oneUser = await User.findById(req.user._id);
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
  res.status(200).json({ success: true, user });
});


exports.deleteUser = deleteOne(User);
