const express = require("express");
const router = express.Router();
const propertyController = require("../controllers/propertyController");
const { privateRoute, access } = require("../middlewares/privateRoute");

router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);

router.use(privateRoute, access("admin"));
router.post("/", propertyController.createProperty);
router.patch("/:id", propertyController.updateProperty);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
