const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { privateRoute, access } = require("../middlewares/privateRoute");

//! subrouters in product router

// get all products
router.get("/", productController.getAllProducts);

// get product by id
router.get("/:id", productController.getProductById);

// create new product
router.post(
  "/",
  privateRoute,
  access("admin"),
  productController.createProduct
);

// update product
router.patch(
  "/:id",
  privateRoute,
  access("admin"),
  productController.updateProduct
);

// delete product
router.delete(
  "/:id",
  privateRoute,
  access("admin"),
  productController.deleteProduct
);

// get reviews by productId
router.get("/:productId/reviews");

module.exports = router;
