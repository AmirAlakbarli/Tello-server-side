const mongoose = require("mongoose");

const basketSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Please provide a userId!"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        variants: [
          {
            name: String,
            value: String,
          },
        ],
        price: Number,
        quantity: Number,
        photo: String,
        name: String,
      },
    ],
    totalCount: Number,
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
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
