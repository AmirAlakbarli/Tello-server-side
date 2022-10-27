const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

router.use(privateRoute, access("admin"));

router.post("/", categoryController.createCategory);
router.patch("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
