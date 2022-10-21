const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", privateRoute, reviewController.getReviews);
router.post("/", privateRoute, access("user"), reviewController.createReview);
router.patch("/:id", privateRoute, access("user"), reviewController.updateReview);

router.delete(
  "/:id",
  privateRoute,
  access("admin", "user"),
  reviewController.deleteReview
);

module.exports = router;
