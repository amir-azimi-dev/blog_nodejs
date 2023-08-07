const commentsModel = require("@models/comments");
const commentsStatuses = require("@models/comments/commentStatus");
const userServices = require("@services/user");
const dateServices = require("@services/date");

class Comments {
    async index(req, res) {
        const comments = await commentsModel.findAll();
        const presentedComments = comments.map(comment => {
            comment.userAvatarURL = userServices.gravatar(comment.user_email);
            comment.jalali_created_at = dateServices.toPersianDate(comment.created_at);
            return comment
        });

        const helpers = {
            commentBG: function (status, options) {
                let cssClass = "bg-";
                switch (status) {
                    case commentsStatuses.APPROVED:
                        cssClass += "approve";
                        break;
                    
                    case commentsStatuses.REJECTED:
                        cssClass += "reject";
                        break;

                    case commentsStatuses.REVIEW:
                        cssClass += "review";
                        break;

                    default: null;
                };

                return cssClass;
            }
        };


        res.adminRender("admin/comments/index", { layout: "admin", comments: presentedComments, helpers });
    };

    async approve(req, res) {
        const commentID = req.params.commentID;
        const result = await commentsModel.approve(commentID);

        res.redirect("/admin/comments");
    };

    async reject(req, res) {
        const commentID = req.params.commentID;
        const result = await commentsModel.reject(commentID);

        res.redirect("/admin/comments");
    };

    async delete(req, res) {
        const commentID = req.params.commentID;
        const result = await commentsModel.delete(commentID);

        res.redirect("/admin/comments");
    };

};

module.exports = new Comments();