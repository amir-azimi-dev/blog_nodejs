const express = require("express");
const path = require("path");
const ehbs = require("express-handlebars");
const hbs = ehbs.create();
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const sessionStore = require("./sessionHandlers/mysql")(session);
const redisStore = require("./sessionHandlers/redis");
const flash = require("connect-flash");
const authMiddleware = require("@middlewares");
const fileUpload = require("express-fileupload");


module.exports = app => {
    app.use(cookieParser());

    app.use(session({
        store: redisStore(),
        secret: "kl3jkh34g5l5jh645rj5v2",
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        cookie: { maxAge: 3600000 * 24 },
        unset: "destroy"
    }));
    app.use(flash())
    authMiddleware(app);

    app.use(fileUpload({
        createParentPath: true,
        userTempFiles: true
    }));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.engine('handlebars', hbs.engine);
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "/../views"));

    // serving static files
    app.use("/static", express.static(path.join(__dirname, "/../../public")));
};