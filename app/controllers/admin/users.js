const usersModel = require("@models/users");
const userStatuses = require("@models/users/userStatus");
const dateServices = require("@services/date");
const usersValidator = require("@validators/user");

class users {
    async index(req, res) {
        const users = await usersModel.findAll();
        users.forEach(user => {
            user.persianCreatedAt = dateServices.toPersianDate(user.created_at);
        });

        const helpers = {
            statusBgClass: function (status, options) {
                let bgClass = "";
                switch (status) {
                    case (userStatuses.ADMIN):
                        bgClass = "bg-admin";
                        break;
                    case (userStatuses.AUTHOR):
                        bgClass = "bg-author";
                        break;
                    default:
                        break;
                };

                return bgClass;
            },
        };


        res.adminRender("admin/users/index", { layout: "admin", users, userRoles: userStatuses, helpers});
    };

    async create(req, res) {
        res.adminRender("admin/users/create", { layout: "admin", userStatuses: userStatuses });
    };

    async store(req, res) {
        const body = req.body;
        const data = {
            full_name: body.fullName.trim(),
            email: body.userEmail.trim(),
            password: body.userPassword,
            role: body.userRole,
        };

        const errors = usersValidator.postUserValidator(data);
        if (errors.length) {
            errors.forEach(err => {
                req.flash("errors", err);
            });
            return res.redirect("/admin/users/create");
        };

        const insertId = await usersModel.store(data);
        if (insertId) {
            req.flash("success", "کاربر با موفقیت اضافه شد.");
        } else {
            req.flash("errors", "خطا در درج اطلاعات !");
        };
        res.redirect("/admin/users");
    };

    async remove(req, res) {
        const deleteID = req.params.userID;
        if (parseInt(deleteID) === 0) {
            res.redirect("/admin/users");
        };

        const result = await usersModel.delete(deleteID);
        if (result) {
            req.flash("success", "کاربر با موفقیت حذف شد.");
        } else {
            req.flash("errors", "خطا در درج اطلاعات !");
        };
        res.redirect("/admin/users");
    };

    async edit(req, res) {
        const userID = req.params.userID;
        if (parseInt(userID) === 0) {
            res.redirect("/admin/users");
        };

        const user_data = await usersModel.find(userID);

        const helpers = {
            hasTheRole: function (userRole, options) {
                return (userRole === user_data.role) ? options.fn(this) : options.inverse(this);
            }
        };

        res.adminRender("admin/users/edit", { layout: "admin", user_data, userStatuses: userStatuses, helpers });

    };

    async update(req, res) {
        const userID = req.params.userID;
        const user = await usersModel.find(userID);
        const oldHashedUserPassword = user.password;

        if (parseInt(userID) === 0) {
            res.redirect("/admin/users");
        };

        const body = req.body;
        const data = {
            full_name: body.fullName.trim(),
            email: body.userEmail.trim(),
            // oldPassword: body.oldUserPassword,
            password: body.newUserPassword || user.password,
            role: body.userRole,
            description: body.description
        };

        const errors = usersValidator.updateUserValidator(data, oldHashedUserPassword);

        if (errors.length) {
            errors.forEach(err => {
                req.flash("errors", err);
            });
            return res.redirect(`/admin/users/edit/${userID}`);
        };

        const insertId = await usersModel.update(userID, data);
        if (insertId) {
            req.flash("success", "کاربر با موفقیت ویرایش شد.");
        } else {
            req.flash("errors", "خطا در درج اطلاعات !");
        };

        res.redirect("/admin/users");
    };
};

module.exports = new users();