module.exports = session => {
    const mySQLstore = require("express-mysql-session")(session);
    const mySQLOptions = {
        multipleStatements: true,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        port: process.env.MYSQL_PORT,
        database: process.env.MYSQL_DATABASE,
    };

    const sessionStore = new mySQLstore(mySQLOptions);
    return sessionStore;
};