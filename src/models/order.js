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
          required: [true, "Product must be defined!"],
        },

        price: {
          type: Number,
          required: [true, "Product price must be defined!"],
        },

        quantity: {
          type: Number,
          required: [true, "Product quantity must be defined!"],
        },
      },
    ],

    condition: {
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

  { timestamps: true, toJSON: { virtuals: true } }
);

orderSchema.virtual("totalAmount").get(function () {
  return this.orderItems.reduce((sum, p) => sum + p.price * p.quantity, 0);
});

orderSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } }).populate(
    "orderItems.product",
    "name categories features price"
  );
  next();
});

orderSchema.pre(/^find/, function (next) {
  this.populate("orderItems.product", "name categories features price");
  next();
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
