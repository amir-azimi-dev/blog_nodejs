const postsModel = require("@models/posts");
const usersModel = require("@models/users");
const commentsModel = require("@models/comments")
const userServices = require("@services/user");
const dateServices = require("@services/date");
const PostPresenter = require("@presenters/post");
const _ = require("lodash");


class Post {
    async showPost(req, res) {
        const postSlug = req.params.post_slug;
        const post = await postsModel.findBySlug(postSlug);

        if (!post) {
            return res.redirect('/404');
        };

        postsModel.viewIncrement(post.id);
        post.views = ++post.views;

        const categories = [];
        const categoriesObj = JSON.parse(post.categories);
        if (categoriesObj) {
            const categoriesArr = Object.entries(categoriesObj);

            categoriesArr.map(item => {
                if (+item[1]) {
                    categories.push(item[0]);
                };
            });
        };
        post.categories = categories;
        post.hasCategory = Boolean(categories.length);

        const relatedPosts = await postsModel.findByCategories(categories, post.id);

        const relatedPostsForPresent = await Promise.all(relatedPosts.map(async relatedPost => {
            relatedPost.excerpt = new PostPresenter(relatedPost).excerpt(30);
            const author = await usersModel.findEmailAndNameByID(relatedPost.author_id);
            relatedPost.author = author.author_name;
            const authorEmail = author.email;
            relatedPost.avatarURL = userServices.gravatar(authorEmail);
            return relatedPost;
        }));

        const author = await usersModel.find(post.author_id);

        const comments = await commentsModel.findByPostId(post.id);
        const presentedComments = await comments.map(comment => {
            comment.jalaliCreatedAt = dateServices.toPersianDate(comment.created_at);
            comment.avatarURL = userServices.gravatar(comment.user_email);
            return comment;
        });

        const newComments = _.groupBy(presentedComments, "parent");

        const presentedPost = {
            ...post,
            author,
            comments: newComments[0],
            avatarURL: userServices.gravatar(author.email),
            jalaliCreatedAt: dateServices.toPersianDate(post.created_at)
        };

        const helpers = {
            hasChild: function (commentID, options) {
                return commentID in newComments;
            },

            getChildren: function (commentID, options) {
                return newComments[commentID];
            }
        }


        res.frontRender("front/post/single", {
            bodyClass: "single-post",
            post: presentedPost,
            relatedPosts: relatedPostsForPresent,
            helpers
        });
    };
};

module.exports = new Post();