module.exports = (req, res, next) => {
    if (!req.session.hasOwnProperty("user")) {
        return res.redirect("/auth/login");
    };

    next();
};