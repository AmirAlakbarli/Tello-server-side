const asyncCatch = require("../utils/asyncCatch");
const User = require("../models/user");
const Basket = require("../models/basket");
const signJWT = require("../utils/jwtGenerator");
const GlobalError = require("../errors/GlobalError");
const Email = require("../utils/email");
const bcrypt = require("bcryptjs");

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

  const url = "https://amiralakbarli.github.io/Tello/";
  const emailHandler = new Email(newUser, url);
  await emailHandler.sendWelcome();

  const token = signJWT({ userId: newUser._id });

  //! create basket for new user
  const newBasket = await Basket.create({
    user: newUser._id,
  });

  //! check if basket was successfully created
  if (!newBasket)
    return next(new GlobalError("Cannot create basket for new user!"));

  newUser.password = undefined;
  res.status(201).json({ success: true, data: { token } });
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
  const token = signJWT({ userId: user._id });

  user.password = undefined;
  res.json({
    success: true,
    data: { token },
  });
});

exports.forgetPassword = asyncCatch(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new GlobalError("User with this email doesn't exist!", 400));
  try {
    const passwordToken = await user.generatePassToken();
    await user.save({ validateBeforeSave: false });

    const path = `https://amiralakbarli.github.io/Tello/resetPassword/${user._id}/${passwordToken}`;
    const emailHandler = new Email(user, path);
    await emailHandler.sendResetPassword();

    res.status(200).json({
      success: true,
      message: "Email was sent!",
    });
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

  const newToken = signJWT({ userId: user._id });

  res.status(201).json({
    success: true,
    data: {
      token: newToken,
    },
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

  if (req.body.newPassword !== req.body.passwordConfirm)
    return next(
      new GlobalError("Confirmation of password isn't same as password")
    );

  user.password = req.body.newPassword;

  await user.save();

  const token = signJWT({ userId: user._id });

  res.status(201).json({
    success: true,
    data: {
      token,
    },
  });
});
