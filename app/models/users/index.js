const db = require("@database/mysql");
const { hashPassword } = require("@services/hash")

exports.findAll = async (cols = []) => {
    const colsSql = cols.length ? cols.join(", ") : "*";
    const [rows] = await db.query(`SELECT ${colsSql}\
    FROM users ORDER BY role DESC;`);
    return rows;
};

exports.store = async data => {
    const hashedPassword = hashPassword(data.password);
    const updatedData = { ...data, password: hashedPassword };
    const [result] = await db.query(`INSERT INTO users SET ?`, updatedData);
    return result.insertId;
};

exports.delete = async userID => {
    const [result] = await db.query("DELETE FROM users WHERE users.id = ?", [userID]);
    return result;
};

exports.find = async userID => {
    const [row] = await db.query(`SELECT *\
    FROM users\
    WHERE users.id = ? LIMIT 1\;`
        , [userID]);

    return row.length ? row[0] : false;
};


exports.update = async (id, data) => {
    const hashedPassword = hashPassword(data.password);
    const updatedData = { ...data, password: hashedPassword };

    const [result] = await db.query("UPDATE users SET ? WHERE id = ? LIMIT 1;", [updatedData, id]);

    return result.affectedRows;
};

exports.findByEmail = async email => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1;", [email]);
    return (rows.length === 1) ? rows[0] : null;
};


exports.findEmailAndNameByID = async authorID => {
    const [row] = await db.query("SELECT email, full_name as author_name FROM users \
    WHERE id = ? LIMIT 1;", authorID);

    return row[0];
};