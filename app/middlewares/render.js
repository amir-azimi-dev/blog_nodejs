const { gravatar } = require("@services/user");
const settingsModel = require("@models/settings");

module.exports = app => {
    app.use(async (req, res, next) => {
        const errors = req.flash("errors");
        const success = req.flash("success");
        const contents = req.flash("contents");
        const hasError = Boolean(errors.length);
        const hasSuccess = Boolean(success.length);

        let user = null;
        if (req.session.user) {
            user = req.session.user;
            user.avatarURL = gravatar(user.email);
        };

        const webTitle = await settingsModel.get("web_title");
        const description = await settingsModel.get("web_description");
        const allowComment = +await settingsModel.get("allow_users_comments");
        res.frontRender = (template, options) => {
            options = { layout: "front", bodyClass: "bg-gray", hasError, hasSuccess, errors, success, webTitle, description, allowComment, user, ...options };
            res.render(template, options);
        };

        res.adminRender = (template, options) => {
            options = { layout: "admin", ...options, hasError, hasSuccess, errors, success, contents: contents[0], user };
            res.render(template, options);
        };

        res.authRender = (template, options) => {
            options = { ...options, hasError, hasSuccess, errors, success };
            res.render(template, options);
        };

        next();
    });
};