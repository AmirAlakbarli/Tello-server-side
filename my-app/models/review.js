const mongoose = require("mongoose");
const Product = require("./product");

const reviewSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Creator of review must be defined!"],
      ref: "user",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product which review belong to must be defined!"],
      ref: "product",
    },
  },

  { timestamps: true }
);

reviewSchema.statics.calcRatingsAverage = async function (productId) {
  const data = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },

    {
      $group: {
        _id: "$product",
        numberOfRating: { $sum: 1 },
        aveRating: { $avg: "$rating" },
      },
    },
  ]);

  await Product.findByIdAndUpdate(productId, {
    ratingsAverage: data[0]?.aveRating ? data[0]?.aveRating : 0,
    ratingsQuantity: data[0]?.numberOfRating ? data[0]?.numberOfRating : 0,
  });
};

reviewSchema.post("save", function (doc) {
  doc.constructor.calcRatingsAverage(this.product);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  doc.constructor.calcRatingsAverage(doc.product);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
