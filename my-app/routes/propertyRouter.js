const express = require("express");
const router = express.Router;
const propertyController = require("../controllers/propertyController");
const { privateRouter, access } = require("../middlewares/privateRoute");

//! subrouters in property router

// get all products
router.get("/", propertyController.getAllProperties);

// get product by id
router.get("/:id", propertyController.getPropertyById);

// create new product
router.post("/", propertyController.createProperty);

// update product
router.patch("/:id", propertyController.updateProperty);

// delete product
router.delete("/:id", propertyController.deleteProduct);

module.exports = router;
