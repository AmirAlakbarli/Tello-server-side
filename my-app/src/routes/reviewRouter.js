const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controllers/reviewController");
const { privateRoute } = require("../middlewares/privateRoute");

router.get("/", reviewController.getReviews);
router.get("/:id", reviewController.getReviewById);

router.use(privateRoute);

router.post("/", reviewController.createReview);
router.patch("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
