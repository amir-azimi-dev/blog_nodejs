const usersModel = require("@models/users");
const hashServices = require("@services/hash");
const userRoles = require("@models/users/userStatus");

exports.login = async (email, password) => {
    const user = await usersModel.findByEmail(email);
    if (!user) {
        return false;
    };

    return hashServices.comparePassword(password, user.password) ? user : false;
};

exports.register = async (email, password) => {
    const data = {
        full_name: email,
        email,
        password,
        role: userRoles.USER
    };
    const insertID = await usersModel.store(data);

    return insertID;
};