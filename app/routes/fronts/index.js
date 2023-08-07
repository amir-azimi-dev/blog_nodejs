const express = require("express");
const frontRouter = express.Router();

// Routers
const homeRouter = require("./home");
const postsRouter = require("./post");

frontRouter.use("/", homeRouter);
frontRouter.use("/p", postsRouter);

module.exports = frontRouter;