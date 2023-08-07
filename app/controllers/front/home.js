const postsModel = require("@models/posts");
const settingsModel = require("@models/settings");
const PostPresenter = require("@presenters/post");

const allCategories = ["nature", "javascript", "front_end", "back-end", "express"];

class Home {
    redirectToHomePage(req, res) {
        res.redirect("/1");
    };

    async index(req, res) {
        const pagination = await getPagination(req, res);
        
        if (!pagination) {
            return;
        };

        const posts = await postsModel.findPagePosts(pagination.currentPage, pagination.perPage);
        const postForPresent = getPresentedPosts(posts);

        const recentPosts = await getRecentPosts();

        res.frontRender("front/home/index", { posts: postForPresent, pagination, allCategories, recentPosts });
    };

    async search(req, res) {
        const keyword = req.query.keyword || "";
        if (!keyword) {
            return res.redirect("/")
        };

        const pagination = await getPagination(req, res, keyword);

        const posts = await postsModel.findByKeyword(keyword, pagination.currentPage, pagination.perPage);
        const postForPresent = getPresentedPosts(posts);

        const recentPosts = await getRecentPosts();

        res.frontRender("front/home/index", { posts: postForPresent, pagination, keyword, hasKeyword: true, allCategories, recentPosts });
    };

    async category(req, res) {
        const category = req.query.keyword || "";
        if (!category) {
            return res.redirect("/")
        };

        const pagination = await getPagination(req, res, category);

        const posts = await postsModel.findByCategory(category, pagination.currentPage, pagination.perPage);
        const postForPresent = getPresentedPosts(posts);

        const recentPosts = await getRecentPosts();

        res.frontRender("front/home/index", { posts: postForPresent, pagination, keyword: category, hasCategory: true, allCategories, recentPosts });
    };
};

const getPagination = async (req, res, keyword) => {
    if (!parseInt(req.params.page)) {
        return res.redirect("/error/404");
    };

    const perPage = await settingsModel.get("posts_per_page");
    const postsCount = await postsModel.count(keyword) || 1;
    const pagesCount = Math.ceil(postsCount / perPage);

    let currentPage = parseInt(req.params.page) || 1;
    (currentPage > pagesCount) && (currentPage = pagesCount);
    (currentPage < 1) && (currentPage = 1);

    const pagination = {
        perPage,
        pagesCount,
        currentPage,
        nextPage: (pagesCount > currentPage) && (currentPage + 1),
        prevPage: (currentPage > 1) && (currentPage - 1),
        isTheLastPage: (currentPage === pagesCount),
        isTheFirstPage: (currentPage === 1),
    };
    return pagination;
};

const getPresentedPosts = posts => {
    const postForPresent = posts.map(post => {
        let postPresenterInstance = new PostPresenter(post);
        post.jalaliCreatedAt = postPresenterInstance.jalaliCreatedAt();
        post.excerptedContent = postPresenterInstance.excerpt();
        return post;
    });

    return postForPresent;
};

const getRecentPosts = async count => {
    const recentPosts = await postsModel.getRecentPosts();
    const recentPresentedPosts = recentPosts.map(post => {
        let postPresenterInstance = new PostPresenter(post);
        post.jalaliCreatedAt = postPresenterInstance.jalaliCreatedAt();
        return post;
    });
    return recentPresentedPosts;
};

module.exports = new Home();