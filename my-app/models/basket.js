const mongoose = require("mongoose");
const Product = require("../models/product");

const basketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        variant: {
          type: Object,
        },
        quantity: Number,
      },
    ],

    totalCount: Number,

    totalPrice: Number,
  },

  { timestamps: true }
);

basketSchema.pre("save", function (next) {
  // this.totalPrice = this.products.reduce((sum, p) => {
  //   return sum + (p.product.price + p.variant.extraPrice) * p.quantity;
  // }, 0);

  this.totalCount = this.products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
  next();
});

basketSchema.pre(/^find/, function (next) {
  this.populate("products.product", "name category price");
  next();
});

const Basket = mongoose.model("basket", basketSchema);

module.exports = Basket;
