const Order = require("../models/order");
const asyncCatch = require("../utils/asyncCatch");
const {
  getById,
  createNew,
  updateOne,
  deleteOne,
} = require("../utils/factory");

exports.getOrdersByUserId = asyncCatch(async (req, res, next) => {
  const userId = await req.user._id;
  const orders = await Order.find({ user: userId });
  res.status(200).json({
    success: true,
    data: {
      orders,
    },
  });
});

exports.getOrderById = getById(Order);
exports.createOrder = createNew(Order);
exports.updateOrder = updateOne(Order);
exports.deleteOrder = deleteOne(Order);
