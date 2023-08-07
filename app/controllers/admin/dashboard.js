const statistics = require("@models/statistics");
const postsModel = require("@models/posts");
const commentsModel = require("@models/comments");
const postValidators = require("@validators/post");

class Dashboard {
    async index(req, res) {
        const data = {
            totalUses: await statistics.totalUsers(),
            totalPosts: await statistics.totalPosts(),
            totalComments: await statistics.totalComments(),
            totalViews: await statistics.totalViews(),
        }

        const recentComments = await commentsModel.getRecentComments();

        res.adminRender("admin/dashboard/index", { layout: "admin", ...data, recentComments });
    };

    async createDraft(req, res) {

        const body = req.body;

        const categories = {
            nature: 0,
            back_end: 1,
            front_end: 1,
            express: 0,
            javascript: 1
        };

        const categoriesJson = JSON.stringify(categories);

        const data = {
            author_id: 1,
            title: body.postTitle.trim(),
            slug: "نامک",
            intro: "مقدمه",
            content: body.postContent.trim(),
            status: 0,
            categories: categoriesJson
        };

        const errors = await postValidators.postMethod(data);
        let hasError;
        if (errors.length) {
            errors.forEach(err => {
                req.flash("errors", err);
            });

            return res.redirect("/admin/dashboard");
        };

        const insertId = await postsModel.store(data);
        if (insertId) {
            req.flash("success", "مطلب با موفقیت درج شد.");
        } else {
            req.flash("errors", "خطا در درج اطلاعات !");
        };

        res.redirect("/admin/dashboard");
    };
};

module.exports = new Dashboard();