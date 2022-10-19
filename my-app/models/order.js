const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: [true, "Please enter a status!"],
      enum: [
        "pending",
        "shipping",
        "cancelled",
        "pickup",
        "declined",
        "refund",
      ],
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
