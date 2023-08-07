const settingsModel = require("@models/settings");
const userRoles = require("@models/users/userStatus");
const authServices = require("@services/auth");
const authValidator = require("@validators/auth");


class Authenticate {
    showLogin(req, res) {
        res.authRender("auth/login", { layout: "auth" })
    };

    async doLogin(req, res) {
        const { email, password } = req.body;
        const user = await authServices.login(email, password);

        if (!user) {
            req.flash('errors', ["ایمیل یا کلمه عبور معتبر نمی‌باشد."])
            return res.redirect("/auth/login");
        };

        req.session.user = user;
        const pathToRedirect = !(user.role === userRoles.USER) ? "/admin/dashboard" : "/";

        return res.redirect(pathToRedirect);
    };

    async showRegister(req, res) {
        const allowRegister = await settingsModel.get("allow_users_register");
        if (!+allowRegister) {
            req.flash("errors", "در حال حاضر امکان ثبت نام کاربر جدبد وجود ندارد");

            res.redirect("/auth/login");
        };
        

        res.authRender("auth/register", { layout: "auth" });
    };

    async doRegister(req, res) {
        const { email, password, confirm_password } = req.body;

        if (!authValidator.isPasswordsMatch(password, confirm_password)) {
            req.flash("errors", "رمز عبور با تکرار آن مطابقت ندارد")
            return res.redirect("/auth/register");
        };

        const isValidEmail = await authValidator.isValidEmail(email);
        if (!isValidEmail) {
            req.flash("errors", `کاربر با ایمیل ${email} قبلا ثبت نام کرده است.`)
            return res.redirect("/auth/register");
        };

        const newUserID = await authServices.register(email, password);
        
        if (!newUserID) {
            req.flash("errors", "در حال حاضر امکان ثبت نام شما وجود ندارد لطفا در زمان دیگری تلاش نمایید.")
            res.redirect("/auth/register");
        };

        req.flash("success", "ثبت نام شما با موفقیت انجام شد.")
        res.redirect("/auth/login");

    };

    logout (req, res) {
        req.session.destroy(err => {
            err && console.log(err);
            return res.redirect("/");
        });
    };
};

module.exports = new Authenticate();