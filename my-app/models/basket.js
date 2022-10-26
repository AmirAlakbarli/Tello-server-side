const mongoose = require("mongoose");

const basketSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, "product must be defined!"],
          ref: "product",
        },
        feature: {
          type: Object,
        },
        price: {
          type: Number,
          required: [true, "Product price must be defined!"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity of product must be defined!"],
        },
      },
    ],
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

basketSchema.virtual("totalCount").get(function () {
  return this.products.reduce((sum, p) => sum + p.price * p.quantity, 0);
});

basketSchema.virtual("totalPrice").get(function () {
  return this.products.reduce((sum, product) => sum + product.quantity, 0);
});

basketSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } }).populate("products.product", "name category price");
  next();
});

const Basket = mongoose.model("basket", basketSchema);

module.exports = Basket;
