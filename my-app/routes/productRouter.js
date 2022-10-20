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
router.post("/", productController.createProduct);

// update product
router.patch("/:id", productController.updateProduct);

// delete product
router.delete("/:id", productController.deleteProduct);

// get reviews by productId
router.get("/:productId/reviews");

module.exports = router;
