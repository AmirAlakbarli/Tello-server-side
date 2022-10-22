const express = require("express");
const router = express.Router();
const basketController = require("../controllers/basketController");
const { privateRoute } = require("../middlewares/privateRoute");

//! get basket by UserId
router.get("/", privateRoute, basketController.getBasketByUserId);
router.post("/", privateRoute, basketController.createBasket);
router.patch("/", privateRoute, basketController.updateBasket);

module.exports = router;
