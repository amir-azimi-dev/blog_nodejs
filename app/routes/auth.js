const express = require("express");
const router = express.Router();
const authController = require("@controllers/auth");

router.get("/login", authController.showLogin);
router.post("/login", authController.doLogin);
router.get("/register", authController.showRegister);
router.post("/register", authController.doRegister);

module.exports = router;