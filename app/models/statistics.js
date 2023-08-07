const db = require("@database/mysql");

exports.totalUsers = async () => {
    const [result] = await db.query("SELECT COUNT(id) AS totalUsers FROM users;");
    return result[0].totalUsers;
};

exports.totalPosts = async () => {
    const [result] = await db.query("SELECT COUNT(id) AS totalPosts FROM posts;");
    return result[0].totalPosts;
};

exports.totalComments = async () => {
    const [result] = await db.query("SELECT COUNT(id) AS totalComments FROM comments;");
    return result[0].totalComments;
};

exports.totalViews = async () => {
    const [result] = await db.query("SELECT SUM(views) AS totalViews FROM posts;");
    const totalViews = result[0].totalViews;
    return totalViews ? totalViews : 0;
};