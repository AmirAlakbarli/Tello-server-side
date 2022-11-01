const express = require("express");
const router = express.Router();
const FAQController = require("../controllers/FAQController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", FAQController.getAllFAQ);
router.get("/:id", FAQController.getFAQById);

router.use(privateRoute, access("admin"));
router.post("/", FAQController.createFAQ);
router.patch("/:id", FAQController.updateFAQ);
router.delete("/:id", FAQController.deleteFAQ);

module.exports = router;
