const commentModel = require("@models/comments");
const postsModel = require("@models/posts");


class Comment {
    async store(req, res) {
        const user = req.session.user;

        const {
            user_url,
            user_comment,
            parent
        } = req.body;

        const slug = req.params.post_slug;

        const post = await postsModel.findBySlug(slug);

        !post && res.redirect("/404");

        const commentData = {
            post_id: post.id,
            author_id: req.session?.user?.id,
            user_name: req.session?.user?.full_name,
            user_email: req.session?.user?.email,
            user_url,
            comment: user_comment,
            parent: parent || 0
        };

        if (!commentData.author_id, !commentData.author_id, !commentData.user_name, !commentData.user_email) {
            req.flash("errors", "برای ثبت نظر باید ابتدا وارد شوید !");
            return res.redirect(`/p/${slug}`);
        };


        const result = await commentModel.store(commentData);
        if (!result) {
            req.flash("errors", "در حال حاضر قادر به ثبت نظر شما نیستیم لطفا بعدا تلاش نمایید.");
        } else {
            req.flash("success", "نظر شما با موقیت ثبت گردید و پس از تایید نمایش داده خواهد شد.");
        };


        res.redirect(`/p/${slug}`);
    };
};

module.exports = new Comment();