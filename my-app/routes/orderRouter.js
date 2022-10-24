const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { privateRoute } = require("../middlewares/privateRoute");

router.get("/", privateRoute, orderController.getOrdersByUserId);
router.get("/:id", privateRoute, orderController.getOrderById);
router.post("/", privateRoute, orderController.createOrder);
router.patch("/:id", privateRoute, orderController.updateOrder);
router.delete("/:id", privateRoute, orderController.deleteOrder);

module.exports = router;
