const asyncCatch = require("../utils/asyncCatch");
const User = require("../models/user");
const Basket = require("../models/basket");
const jwt = require("jsonwebtoken");
const GlobalError = require("../errors/GlobalError");
const sendEmail = require("../utils/email");
const bcrypt = require("bcryptjs");

function signJWT(id) {
  const token = jwt.sign({ id }, process.env.JWT_SIGNATURE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}

exports.signUp = asyncCatch(async (req, res, next) => {
  //! check if password and confirmation of password are same
  if (req.body.password !== req.body.passwordConfirm)
    return next(
      new GlobalError(
        "Password and confirmation of password are not the same",
        401
      )
    );

  //! create new user
  const newUser = await User.create({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    password: req.body.password,
  });

  //! check if user account was successfully created
  if (!newUser)
    return next(new GlobalError("Cannot create a new user account!"));

  await newUser.save();

  const token = signJWT(newUser._id);

  //! create basket for new user
  const newBasket = await Basket.create({
    userId: newUser._id,
  });

  //! check if basket was successfully created
  if (!newBasket)
    return next(new GlobalError("Cannot create basket for new user!"));

  newUser.password = undefined;
  res.status(201).json({ success: true, data: { token, user: newUser } });
});

exports.login = asyncCatch(async (req, res, next) => {
  //! Check if email and password are inserted
  const { email, password } = req.body;
  if (!(email && password))
    return next(new GlobalError("Please insert email and password!"));

  //! Check if email and password are correct
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new GlobalError("This user not be found!", 401));
  const isCorrect = await user.checkPassword(password, user.password);
  if (!(user && isCorrect))
    return next(new GlobalError("Email or password is incorrect!"));

  //! Sign JWT
  const token = signJWT(user._id);

  user.password = undefined;
  res.json({ success: true, data: { token, user } });
});

exports.forgetPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new GlobalError("User with this email doesn't exist!", 400));
  try {
    const passwordToken = await user.generatePassToken();
    await user.save({ validateBeforeSave: false });

    const path = `Please follow the link to change password: ${
      req.protocol
    }://${req.get("host")}/api/v1/resetPassword/${user._id}/${passwordToken}`;

    await sendEmail({
      email: user.email,
      subject: "Change password",
      message: path,
    });

    res.status(200).json({ success: true, message: "Email was sent!" });
  } catch (error) {
    return next(new GlobalError("Cannot sent link to reset password!", 401));
  }
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  const userId = await req.params.id;
  const token = await req.params.token;
  const user = await User.findById(userId);

  if (!user) return next(new GlobalError("This user not be found!", 401));

  if (!user.forgetPassword || Date.parse(user.resetExpires) < Date.now())
    return next(new GlobalError("Token is ivalid or expired!"));

  const isOkay = await bcrypt.compare(token, user.forgetPassword);
  if (!isOkay)
    return next(
      new GlobalError("This token for resetting password isn't correct!", 401)
    );

  if (req.body.password !== req.body.passwordConfirm)
    return next(
      new GlobalError(
        "password and confirmation of password are not the same",
        401
      )
    );

  user.password = req.body.password;
  user.resetExpires = undefined;
  user.forgetPassword = undefined;

  await user.save();

  const newToken = signJWT(user._id);

  res.status(201).json({
    success: true,
    token: newToken,
  });
});

exports.changePassword = asyncCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  if (
    !req.body.currentPassword ||
    !req.body.newPassword ||
    !req.body.passwordConfirm
  )
    return next(
      new GlobalError(
        "old password is incorrect or new password wasn't entered!",
        403
      )
    );
  const isPasswordCorrect = await user.checkPassword(
    req.body.currentPassword,
    user.password
  );

  if (!isPasswordCorrect)
    return next(new GlobalError("Incorrect old password!", 403));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signJWT(user._id);

  res.status(201).json({
    success: true,
    token,
  });
});
