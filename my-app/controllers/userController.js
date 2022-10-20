const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const User = require("../models/user");

exports.changeUserData = asyncCatch(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user._id, {
    name: req.body.name,
    email: req.body.email,
  });

  if (!user) return next(new GlobalError("Cannot change data", 500));
  res.status(200).json({ success: true, user });
});
