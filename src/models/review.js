const mongoose = require("mongoose");
const Product = require("./product");

const reviewSchema = mongoose.Schema(
  {
    status: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 1,
      select: false,
    },

    description: {
      type: String,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User of review must be defined!"],
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
        status: 1,
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

reviewSchema.pre(/^find/, function (next) {
  this.find({ status: { $ne: 0 } }).populate(
    "user",
    "name surname email phoneNumber photo"
  );
  next();
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
