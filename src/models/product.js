const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

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

    images: [String],

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    ratingsAverage: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true, toJSON: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } })
    .populate("reviews")
    .populate("categories");
  next();
});

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  next();
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
