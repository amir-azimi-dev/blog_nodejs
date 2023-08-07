const express = require("express");
const adminRouter = express.Router();

// Routers
const dashboardRouter = require("./dashboard");
const postsRouter = require("./posts");
const commentsRouter = require("./comments");
const usersRouter = require("./users");
const settingsRouter = require("./settings");

adminRouter.use(dashboardRouter);
adminRouter.use("/posts", postsRouter);
adminRouter.use("/comments", commentsRouter);
adminRouter.use("/users", usersRouter);
adminRouter.use("/settings", settingsRouter)

module.exports = adminRouter;