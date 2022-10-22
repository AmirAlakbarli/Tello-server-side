const Basket = require("../models/basket");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const jwt = require("jsonwebtoken");

function signJWT(id) {
  const token = jwt.sign({ id }, process.env.JWT_SIGNATURE, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
}

exports.getBasket = asyncCatch(async (req, res, next) => {
  let oneBasket;
  const userId = req?.user?._id;
  const basketId = req?.basket?._id;
  if (userId) oneBasket = await Basket.findOne({ userId });
  if (basketId)
    oneBasket = oneBasket ? oneBasket : await Basket.findById(basketId);
  if (!oneBasket) return next(new GlobalError("Invalid id: FINDONE", 404));

  res.status(200).json({
    success: true,
    data: {
      basket: oneBasket,
    },
  });
});

exports.createBasket = asyncCatch(async (req, res, next) => {
  const newBasket = await Basket.create({ products: req.body.products });
  if (!newBasket) return next(new GlobalError("Cannot create new basket", 500));
  const token = signJWT(newBasket._id);
  res.status(200).json({
    success: true,
    data: {
      token,
    },
  });
});

exports.updateBasket = asyncCatch(async (req, res, next) => {});
