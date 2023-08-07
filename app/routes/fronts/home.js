const express = require("express");
const router = express.Router();
const homeController = require("@controllers/front/home");

router.get("/", homeController.redirectToHomePage);
router.get("/:page", homeController.index);
router.get("/search/:page", homeController.search);
router.get("/category/:page", homeController.category);

module.exports = router;
