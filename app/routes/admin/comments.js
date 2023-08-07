const express = require("express");
const router = express.Router();
const commentsController = require("@controllers/admin/comments");

router.get("/", commentsController.index);
router.get("/approve/:commentID", commentsController.approve);
router.get("/reject/:commentID", commentsController.reject);
router.get("/delete/:commentID", commentsController.delete);

module.exports = router;