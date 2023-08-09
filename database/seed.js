require('dotenv').config();
const db = require("./mysql");
require("module-alias/register");
const {hashPassword} = require("@services/hash");
const userRoles = require("@models/users/userStatus");

const adminData = {
    full_name: "امیر عظیمی",
    email: "amir@gmail.com",
    password: hashPassword("13811381"),
    role: userRoles.ADMIN
};

const seedAdmin = `INSERT INTO users SET ?;`

const seed = async adminData => {
    const [seedAdminResult] = await db.query(seedAdmin, [adminData]);
    console.log(seedAdminResult);
};

seed(adminData);