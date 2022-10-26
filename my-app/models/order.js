const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User must be defined!"],
      ref: "user",
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
        },
      },
    ],

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
  },

  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } });
  next();
});

orderSchema.pre(/^find/, function (next) {
  this.populate("orderItems.product", "name categories features price");
  next();
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
