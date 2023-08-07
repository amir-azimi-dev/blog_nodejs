const postsModel = require("@models/posts");
const usersModel = require("@models/users");
const postsStatuses = require("@models/posts/postStatus");
const userRoles = require("@models/users/userStatus");
const dateServices = require("@services/date");
const uploadService = require("@services/upload");
const postValidators = require("@validators/post");

const fs = require("fs");
const path = require("path");

class Posts {
    async index(req, res) {
        const posts = await postsModel.findAll();
        posts.forEach(post => {
            post.persianCreatedAt = dateServices.toPersianDate(post.created_at);
        });

        const helpers = {
            statusBgClass: function (status, options) {
                let bgClass = "bg-";
                switch (status) {
                    case (postsStatuses.PUBLISHED):
                        bgClass += "published";
                        break;
                    case (postsStatuses.REVIEW):
                        bgClass += "review";
                        break;
                    default:
                        bgClass += "draft";
                        break;
                };

                return bgClass
            }
        };

        res.adminRender("admin/posts/index", { layout: "admin", posts, helpers });
    };

    async create(req, res) {
        const users = await usersModel.findAll(['id', 'full_name', 'role']);
        const presentedUsers = await users.map(user => {
            user.isAuthor = (+user.role !== userRoles.USER);
            return user;
        });

        const helpers = {
            isSelected: function (authorId, options) {
                const postAuthorId = req.query.id;
                return authorId == postAuthorId ? "selected" : "";
            }
        };

        res.adminRender("admin/posts/create", { layout: "admin", users: presentedUsers, postStatus: postsStatuses, helpers });
    };

    async store(req, res) {
        const body = req.body;
        const categories = {
            nature: +body.nature || 0,
            back_end: +body.back_end || 0,
            front_end: +body.front_end || 0,
            express: +body.express || 0,
            javascript: +body.javascript || 0,
        };
        const categoriesJson = JSON.stringify(categories);

        const { newFileName, newFileExt } = uploadService.getFileInformation(req);

        const data = {
            author_id: body.author.trim(),
            title: body.postTitle.trim(),
            slug: body.postSlug.trim(),
            intro: body.intro.trim(),
            content: body.postContent.trim(),
            status: body.postStatus.trim(),
            categories: categoriesJson,
            thumbnail: newFileName
        };

        const errors = await postValidators.postMethod(data, true);
        let hasError;
        if (errors.length) {
            hasError = 1;
            errors.forEach(err => {
                req.flash("errors", err)
            });
        };

        const hasTheRightExt = uploadService.hasTheRightExt(newFileExt);
        if (!hasTheRightExt) {
            hasError = 1;

            req.flash("errors",
                "شما باید عکس مربوطه را با یکی از فرمت‌های jpg ،png یا svg بارگزاری کنید.");
        };

        if (hasError) {
            req.flash("contents", { contents: data });
            return res.redirect(`/admin/posts/create/?id=${data.author_id}`);
        };

        const isSuccessful = await uploadService.upload(req, res, newFileName);
        if (!isSuccessful) {
            req.flash("errors", "خطا در بارگزاری عکس !");
            return res.redirect("/admin/posts");
        };

        const insertId = await postsModel.store(data);
        if (insertId) {
            req.flash("success", "مطلب با موفقیت درج شد.");
        } else {
            req.flash("errors", "خطا در درج اطلاعات !");
        };
        res.status(200).redirect("/admin/posts");
    };

    async remove(req, res) {
        const postID = req.params.postID;
        if (parseInt(postID) === 0) {
            res.redirect("/admin/posts");
        };

        const result = await postsModel.delete(postID);
        if (result) {
            req.flash("success", "مطلب با موفقیت حذف شد.")
        };
        res.redirect("/admin/posts");
    };

    async edit(req, res) {
        const postID = req.params.postID;
        if (parseInt(postID) === 0) {
            res.redirect("/admin/posts");
        };

        const post = await postsModel.find(postID);
        if (!post) {
            return res.redirect("/admin/posts");
        };

        post.categories = JSON.parse(post.categories);

        const users = await usersModel.findAll(['id', 'full_name', 'role']);
        const presentedUsers = await users.map(user => {
            user.isAuthor = (+user.role !== userRoles.USER);
            return user;
        });

        const helpers = {
            isPostAuthor: function (userID, options) {
                return (userID === post.author_id) ? options.fn(this) : options.inverse(this);
            },

            isSelected: function (status, options) {
                return (post.status === status) ? options.fn(this) : options.inverse(this);
            },

            getStatus: function (status, options) {
                return parseInt(status);
            }
        };

        res.adminRender("admin/posts/edit", { layout: "admin", users: presentedUsers, post, postStatus: postsStatuses, helpers });
    };

    async update(req, res) {
        const postID = req.params.postID;
        if (parseInt(postID) === 0) {
            res.redirect("/admin/posts");
        };

        const body = req.body;

        const categories = {
            nature: +body.nature || 0,
            back_end: +body.back_end || 0,
            front_end: +body.front_end || 0,
            express: +body.express || 0,
            javascript: +body.javascript || 0,
        };

        const categoriesJson = JSON.stringify(categories);

        const { newFileName, newFileExt } = uploadService.getFileInformation(req);

        const data = {
            author_id: body.author.trim(),
            title: body.postTitle.trim(),
            slug: body.postSlug.trim(),
            intro: body.intro.trim(),
            content: body.postContent.trim(),
            status: body.postStatus.trim(),
            categories: categoriesJson,
            thumbnail: newFileName
        };

        const errors = await postValidators.postMethod(data);
        let hasError = 0;
        if (errors.length) {
            hasError = 1;
            errors.forEach(err => {
                req.flash("errors", err)
            });
        };

        const hasTheRightExt = uploadService.hasTheRightExt(newFileExt, true);
        if (!hasTheRightExt) {
            hasError = 1;

            req.flash("errors",
                "شما باید عکس مربوطه را با یکی از فرمت‌های jpg ،png یا svg بارگزاری کنید.");
        };

        if (hasError) {
            data.content && await postsModel.updateContent(postID, data.intro, data.content);
            return res.redirect(`/admin/posts/edit/${postID}`);
        };

        const post = await postsModel.find(postID);

        if (newFileName) {
            const isSuccessful = await uploadService.upload(req, res, newFileName);
            if (!isSuccessful) {
                req.flash("errors", "خطا در بارگزاری عکس !");
                return res.redirect("/admin/posts");
            };

            if (post.thumbnail) {
                const removablePath = path.join(process.cwd(), "public", "upload", "thumbnails", post.thumbnail);
                fs.unlinkSync(removablePath);
                console.log("deleted successfully: ", removablePath);
            };
        };

        !newFileName && (data.thumbnail = post.thumbnail);
        const result = await postsModel.update(postID, data);
        if (result) {
            req.flash("success", "مطلب با موفقیت بروزرسانی شد.");
            return res.status(200).redirect("/admin/posts");
        }

        req.flash("errors", "خطا در درج اطلاعات در پایگاه داده !");
        return res.redirect("/admin/posts");
    };
};

module.exports = new Posts();