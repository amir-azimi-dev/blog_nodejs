const userRoles = require("@models/users/userStatus");

module.exports = (req, res, next) => {
    if (req.session.user.role === userRoles.USER) {
        return res.redirect("/");
    };

    next();
};