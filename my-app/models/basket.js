const mongoose = require("mongoose");

const basketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a userId!"],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Basket = mongoose.model("basket", basketSchema);

module.exports = Basket;
