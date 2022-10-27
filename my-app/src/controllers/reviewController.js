const asyncCatch = require("../utils/asyncCatch");
const GlobalError = require("../errors/GlobalError");
const Review = require("../models/review");
const Product = require("../models/product");
const { getById, updateOne, deleteOne } = require("../utils/factory");

// exports.getAllReviews = asyncCatch(async (req, res, next) => {
//   console.log("all");
//   const reviews = await Review.find();
//   res.status(200).json({ success: true, data: { reviews } });
// });

// exports.getReviewsByProductId = asyncCatch(async (req, res, next) => {
//   const productId = req.params.productId;
//   const reviews = await Review.find({ tour: productId });
//   res.status(200).json({ success: true, data: { reviews } });
// });

//! merging of getAllReviews and getReviewsByProductId
exports.getReviews = asyncCatch(async (req, res, next) => {
  const productId = req.params.productId;
  if (productId) {
    const product = await Product.findById(productId);
    if (!product)
      return next(
        new GlobalError("Product which you want to show review not found!", 404)
      );
    const reviews = await Review.find({ product: productId });
    res.status(200).json({ success: true, data: { reviews } });
  } else {
    const reviews = await Review.find();
    res.status(200).json({ success: true, data: { reviews } });
  }
});

exports.getReviewById = getById(Review);

exports.createReview = asyncCatch(async (req, res, next) => {
  const productId = req.params.productId;
  const product = await Product.findById(productId);
  if (!product)
    return next(
      new GlobalError("Product which you want to add review not found!", 500)
    );

  req.body.status = undefined;

  const newReview = await Review.create({
    ...req.body,
    product: productId,
    user: req.user._id,
  });

  if (!newReview) return new GlobalError("Review cannot be created!", 500);

  newReview.status = undefined;

  res.status(201).json({
    success: true,
    data: {
      review: newReview,
    },
  });
});

exports.updateReview = updateOne(Review);

exports.deleteReview = deleteOne(Review);
