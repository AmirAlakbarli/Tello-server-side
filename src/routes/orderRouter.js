const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { privateRoute } = require("../middlewares/privateRoute");

router.use(privateRoute);
router.get("/", orderController.getOrdersByUserId);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.patch("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
