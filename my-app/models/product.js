const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name must be defined!"],
    },

    description: {
      type: String,
    },

    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category id must be defined!"],
      },
    ],

    features: {
      type: Object,
    },

    price: {
      type: Number,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    ratingsAverage: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
