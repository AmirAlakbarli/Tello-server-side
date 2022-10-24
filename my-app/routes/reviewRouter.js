const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", reviewController.getReviews);

router.get("/:id", reviewController.getReviewById);

router.post(
  "/",
  privateRoute,
  access("user", "admin"),
  reviewController.createReview
);

router.patch(
  "/:id",
  privateRoute,
  access("user", "admin"),
  reviewController.updateReview
);

router.delete(
  "/:id",
  privateRoute,
  access("user", "admin"),
  reviewController.deleteReview
);

module.exports = router;
