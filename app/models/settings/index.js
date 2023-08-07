const db = require("@database/mysql");

exports.findAll = async (cols = []) => {
    const colsSql = cols.length ? cols.join(", ") : "*";
    const [rows] = await db.query(`SELECT ${colsSql}\
    FROM settings
    ;`);
    return rows;
};

exports.update = async (data) => {

    const updateQuery = Object.keys(data).map(setting_name => {
        return `UPDATE settings SET setting_value= "${data[setting_name]}" WHERE setting_name= "${setting_name}";`
    });

    const [result] = await db.query(updateQuery.join(" "));
    return result.length || 0;
};

exports.get = async key => {
    const [row] = await db.query("SELECT setting_value as result FROM settings WHERE setting_name = ? LIMIT 1;", [key]);

    return row.length ? row[0].result : null;
};