// Routers
const adminRouter = require("./admin");
const authRouter = require("./auth");
const frontRouter = require("./fronts")
const authController = require("@controllers/auth");

// Middlewares
const authMiddleware = require("@middlewares/authenticate");
const adminMiddleware = require("@middlewares/admin");
const guestMiddleware = require("@middlewares/guest");

module.exports = app => {
    app.use("/", frontRouter);
    app.use("/admin", [authMiddleware, adminMiddleware], adminRouter);
    app.use("/auth", [guestMiddleware], authRouter);
    app.get("/user/logout", authController.logout);
    app.get("/error/404", (req, res) => res.render("errors/404", {layout: "error"}));
};