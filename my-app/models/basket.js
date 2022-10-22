const mongoose = require("mongoose");

const basketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    products: [
      {
        productId: {
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

basketSchema.pre("save", function () {
  this.totalPrice = this.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  this.totalCount = this.products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );
});

const Basket = mongoose.model("basket", basketSchema);

module.exports = Basket;
