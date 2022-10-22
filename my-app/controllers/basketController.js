const Basket = require("../models/basket");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const { deleteOne } = require("../utils/factory");

exports.getBasketByUserId = asyncCatch(async (req, res, next) => {
  const userId = req.user._id;
  const oneBasket = await Basket.findOne({ userId });
  if (!oneBasket) return next(new GlobalError("Invalid id: FINDONE", 404));
  res.status(200).json({
    success: true,
    data: {
      basket: oneBasket,
    },
  });
});

exports.createBasket = asyncCatch(async (req, res, next) => {
  // const userId = req.user._id;
  const newBasket = await Basket.create({products:req.body.products});
  if (!newBasket) return next(new GlobalError("Cannot create new basket", 500));
  res.status(200).json({
    success: true,
    data: {
      basket: newBasket,
    },
  });
});

exports.updateBasket = asyncCatch(async (req, res, next) => {});
