const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.post(
  "/",
  privateRoute,
  access("admin"),
  categoryController.createCategory
);

router.patch(
  "/:id",
  privateRoute,
  access("admin"),
  categoryController.updateCategory
);

router.delete(
  "/:id",
  privateRoute,
  access("admin"),
  categoryController.deleteCategory
);

module.exports = router;