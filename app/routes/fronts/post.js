const express = require("express");
const router = express.Router();
const postController = require("@controllers/front/post");
const commentController = require("@controllers/front/comment");

router.get("/:post_slug", postController.showPost);
router.post("/:post_slug/comments", commentController.store);

module.exports = router;
