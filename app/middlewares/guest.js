const userRoles = require("@models/users/userStatus");

module.exports = (req, res, next) => {
    if (req.session.hasOwnProperty("user")) {
        const redirectPath = !(req.session.user.role === userRoles.USER) ? "/admin/dashboard" : "/";
        return res.redirect(redirectPath);
    };

    next();
};