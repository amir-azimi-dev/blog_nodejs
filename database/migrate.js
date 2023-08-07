const db = require("./mysql");

const usersSql = `CREATE TABLE IF NOT EXISTS users (\
id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
full_name VARCHAR(100) NOT NULL,\
email VARCHAR(100) NOT NULL,\
password VARCHAR(100) NOT NULL,\
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
role TINYINT(2) DEFAULT 0);`

const postsSql = `CREATE TABLE IF NOT EXISTS posts (\
id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
author_id INT UNSIGNED NOT NULL,\
title VARCHAR(100) NOT NULL,\
slug VARCHAR(100) NOT NULL,\
intro TEXT NOT NULL,\
content LONGTEXT NOT NULL,\
status TINYINT(1) NOT NULL DEFAULT 0,\
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
views INT NOT NULL,\
thumbnail TEXT,\
comments INT NOT NULL,\
categories JSON);`

const commentsSql = `CREATE TABLE IF NOT EXISTS comments (\
id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
author_id INT UNSIGNED,\
post_id INT UNSIGNED NOT NULL,\
user_name VARCHAR(100),\
user_email VARCHAR(100),\
user_url VARCHAR(100),\
comment TEXT NOT NULL,\
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
status TINYINT(1) NOT NULL DEFAULT 0,\
parent INT NOT NULL DEFAULT 0);`

const settingsSql = `CREATE TABLE IF NOT EXISTS settings (\
id INT UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,\
setting_name VARCHAR(100) NOT NULL,\
setting_value TEXT NOT NULL);`

const migrate = async () => {
    const [usersSqlResult] = await db.query(usersSql);
    console.log(usersSqlResult);

    const [postsSqlResult] = await db.query(postsSql);
    console.log(postsSqlResult);
    
    const [commentsSqlResult] = await db.query(commentsSql);
    console.log(commentsSqlResult);
    
    const [settingsSqlResult] = await db.query(settingsSql);
    console.log(settingsSqlResult);
};

migrate();