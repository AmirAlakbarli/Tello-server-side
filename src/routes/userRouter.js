const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { privateRoute } = require("../middlewares/privateRoute");

//! subrouters in user router

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword);
router.patch("/resetPassword/:id/:token", authController.resetPassword);

router.use(privateRoute);
router.patch("/userInfo/changePassword", authController.changePassword);
router.get("/userInfo",userController.getUser)
router.patch("/userInfo", userController.updateUser);
router.delete("/userInfo", userController.deleteUser);

module.exports = router;
