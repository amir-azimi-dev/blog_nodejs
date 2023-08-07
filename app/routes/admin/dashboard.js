const express = require("express");
const router = express.Router();
const dashboardController = require("@controllers/admin/dashboard");

router.get("/dashboard", dashboardController.index);
router.post("/dashboard", dashboardController.createDraft);

module.exports = router;