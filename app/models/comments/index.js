const db = require("@database/mysql");
const commentStatuses = require("./commentStatus");

exports.findAll = async () => {
    const [rows] = await db.query(`SELECT c.*, p.title\
    FROM comments c\
    JOIN posts p\
    on c.post_id = p.id\
    ORDER BY c.status ASC, c.created_at DESC
    ;`);
    return rows;
};


exports.approve = async (commentID) => {
    const [result] = await db.query("UPDATE comments SET status = ? WHERE id = ? LIMIT 1;", [commentStatuses.APPROVED, commentID]);
    return result.affectedRows;
};

exports.reject = async (commentID) => {
    const [result] = await db.query("UPDATE comments SET status = ? WHERE id = ? LIMIT 1;", [commentStatuses.REJECTED, commentID]);

    return result.affectedRows;
};

exports.delete = async commentID => {
    const [result] = await db.query("DELETE FROM comments WHERE comments.id = ?", [commentID]);
    return result.affectedRows;
};


exports.store = async data => {
    const [result] = await db.query(`INSERT INTO comments SET ?`, data);
    return result.insertId;
};


exports.findByPostId = async (postID, status = commentStatuses.APPROVED) => {
    const [result] = await db.query("SELECT * from comments \
    WHERE post_id = ? AND status = ? \
    ORDER BY created_at DESC;\
    ", [postID, status]);

    return result;
};

exports.getRecentComments = async (count = 6) => {
    const [result] = await db.query("SELECT user_name as author, comment FROM comments \
    WHERE status = ? \
    ORDER BY created_at DESC \
    LIMIT ?;", [commentStatuses.REVIEW, count]);
    return result;
};