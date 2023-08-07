const db = require("./mysql");
const {hashPassword} = require("@services/hashServices");
const userRoles = require("@models/users/usersStatus")();

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