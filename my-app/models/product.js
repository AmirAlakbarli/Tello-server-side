const mongoose = require("mongoose");
const Category = require("./category");
const Variant = require("./variant");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name must be defined!"],
      trim: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: [true, "Product price must be defined!"],
    },

    imageCoverId: {
      type: String,
      required: [true, "Product image cover must be defined!"],
    },

    ratingsAverage: {
      type: Number,
    },

    sku: String,

    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category id must be defined!"],
      },
    ],

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    variants: [
      {
        variantId: { type: mongoose.Schema.Types.ObjectId, ref: "variant" },
        variantName: String,
        values: [
          {
            name: String,
            price: Number,
            images: [
              {
                url: String,
                urlId: String,
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

const increaseCountOfProducts = async (id) => {
  await Category.findByIdAndUpdate(id, {
    $inc: { countOfProducts: 1 },
  });
};

productSchema.statics.calcCountOfProductsByCategory = async function(categoryIds) {
  categoryIds?.map((el) => increaseCountOfProducts(el));
};

//! Alcabas Refiqe
productSchema.post("save", async function (doc) {
  doc.constructor.calcCountOfProductsByCategory(this.category);
});

productSchema.post(/^findOneAnd/, async function (doc) {
  doc.constructor.calcCountOfProductsByCategory(this.category);
});

productSchema.pre("save", async function (next) {
  for (let i = 0; i < this.variants.length; i++) {
    const variant = await Variant.findById(this.variants[i].variantId);
    this.variants[i].variantName = variant.name;
  }
  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
