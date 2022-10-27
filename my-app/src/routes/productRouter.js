const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { privateRoute, access } = require("../middlewares/privateRoute");
//! merging with review router
const reviewRouter = require("../routes/reviewRouter");

//! subrouters in product router

// get all products
router.get("/", productController.getAllProducts);

// get product by id
router.get("/:id", productController.getProductById);

//! go review router for get review by productId
router.use("/:productId/reviews", reviewRouter);

router.use(privateRoute, access("admin"));
// create new product
router.post("/", productController.createProduct);

// update product
router.patch("/:id", productController.updateProduct);

// delete product
router.delete("/:id", productController.deleteProduct);

module.exports = router;
