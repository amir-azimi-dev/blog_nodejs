const db = require("@database/mysql");
const postStatuses = require("./postStatus");

exports.findAll = async () => {
    const [rows] = await db.query(`SELECT p.*, u.full_name, u.id as user_id\
    FROM posts p\
    LEFT JOIN users u\
    ON p.author_id = u.id\
    ORDER BY p.status ASC, p.created_at DESC\
    ;`);
    return rows;
};

exports.find = async postID => {
    const [row] = await db.query(`SELECT p.*, u.full_name, u.id as user_id\
    FROM posts p\
    LEFT JOIN users u\
    ON p.author_id = u.id\
    WHERE p.id = ? LIMIT 1\;`
        , [postID]);
    return row.length ? row[0] : false;
};

exports.findAllSlugs = async () => {
    const [result] = await db.query("SELECT slug FROM posts");
    return result || 0;
};

exports.store = async data => {
    const [result] = await db.query(`INSERT INTO posts SET ?`, data);
    return result.insertId;
};

exports.delete = async postID => {
    const [result] = await db.query("DELETE FROM posts WHERE posts.id = ?", [postID]);
    return result.affectedRows;
};

exports.update = async (id, data) => {
    const [result] = await db.query("UPDATE posts SET ? WHERE id = ? LIMIT 1;", [data, id]);

    return result.affectedRows;
};

exports.updateContent = async (id, intro, content) => {
    const [result] = await db.query("UPDATE posts SET intro = ?, content = ? WHERE id = ? LIMIT 1;", [intro, content, id]);

    return result.affectedRows;
};

exports.count = async (keyword) => {
    let conditionQuery;
    const categories = ["nature", "front_end", "back_end", "express", "javascript"];
    let isCategory = categories.some(category => {
        return category === keyword;
    });

    if (isCategory) {
        conditionQuery = `AND JSON_EXTRACT(categories , '$.${keyword}') = 1`;
    } else {
        conditionQuery = keyword ? `AND title LIKE '%${keyword}%'` : '';
    };
    const [numOfPosts] = await db.query(`SELECT COUNT(id) AS count FROM posts \
    WHERE status = ? ${conditionQuery} ;`, [postStatuses.PUBLISHED])
    return numOfPosts[0].count;
};

exports.findPagePosts = async (page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const [rows] = await db.query(`SELECT p.*, u.full_name as author, u.id as user_id\
    FROM posts p\
    LEFT JOIN users u\
    ON p.author_id = u.id\ 
    WHERE p.status = ?\
    ORDER BY p.created_at DESC\
    LIMIT ${offset}, ${perPage}\
    ;`, [postStatuses.PUBLISHED]);
    return rows;
};

exports.findBySlug = async slug => {
    const [rows] = await db.query(`SELECT *\
    FROM posts\
    WHERE slug = ? AND status = ?\
    LIMIT 1\
    ;`, [slug, postStatuses.PUBLISHED]);

    return rows[0];
};


exports.findByCategories = async (categoriesArray, postID) => {
    const queryConditionsArr = categoriesArray.map(category => {
        return `JSON_EXTRACT(categories , '$.${category}') = 1`;
    });

    let queryConditions = queryConditionsArr.join(" OR ");

    if (queryConditions.length) {
        queryConditions = "AND (" + queryConditions + ")";
    };

    const [rows] = await db.query(`SELECT *\
    FROM posts\
    WHERE id != ${postID} AND status = ? \
    ${queryConditions}\
    ORDER BY created_at DESC\
    LIMIT 3\
    ;`, [postStatuses.PUBLISHED]);

    return rows;
};

exports.findByKeyword = async (keyword, page = 1, perPage = 10) => {
    keyword = `%${keyword}%`
    const offset = perPage * (page - 1);
    const [rows] = await db.query(`SELECT p.*, \
    u.full_name as author, u.id as user_id\
    FROM posts p\
    LEFT JOIN users u\
    ON p.author_id = u.id\
    WHERE p.title LIKE ? AND p.status = ?\
    ORDER BY p.created_at DESC\
    LIMIT ${offset}, ${perPage}\
    ;`, [keyword, postStatuses.PUBLISHED]);

    return rows;
};

exports.findByCategory = async (category, page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const [rows] = await db.query(`SELECT p.*, \
    u.full_name as author, u.id as user_id\
    FROM posts p\
    LEFT JOIN users u\
    ON p.author_id = u.id\
    WHERE p.status = ?\
    AND JSON_EXTRACT(p.categories , '$.${category}') = 1\
    ORDER BY p.created_at DESC\
    LIMIT ${offset}, ${perPage}\
    ;`, [postStatuses.PUBLISHED, category]);

    return rows;
};


exports.getRecentPosts = async (count = 5) => {
    const [result] = await db.query("SELECT * FROM posts \
    WHERE status = ? \
    ORDER BY created_at DESC \
    LIMIT ?;", [postStatuses.PUBLISHED, count]);
    return result;
};

exports.viewIncrement = async id => {
    const [result] = await db.query("UPDATE posts \
    SET views = views + 1 \
    WHERE id = ? \
    LIMIT 1;", [id]);
    return result;
};