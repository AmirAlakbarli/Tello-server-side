const Basket = require("../models/basket");
const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const { deleteOne } = require("../utils/factory");

exports.getBasketByUserId = asyncCatch(async (req, res, next) => {
  const userId = req.user._id;
  const oneBasket = await Basket.find({userId});
  if (!oneBasket) return next(new GlobalError("Invalid id: FINDONE", 404));
  res.status(200).json({
    success: true,
    data: {
      basket: oneBasket,
    },
  });
});

exports.createBasket = asyncCatch(async (req, res, next) => {
    const newBasket = Basket.create(req.body)
})

exports.updateBasket = asyncCatch(async (req, res, next) => {});
