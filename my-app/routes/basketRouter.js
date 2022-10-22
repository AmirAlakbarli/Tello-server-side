const express = require("express");
const router = express.Router();
const basketController = require("../controllers/basketController");
const { privateRoute } = require("../middlewares/privateRoute");

//! get basket by UserId
router.post("/", basketController.createBasket);
router.get("/", privateRoute, basketController.getBasket);
router.patch("/", privateRoute, basketController.updateBasket);

module.exports = router;
