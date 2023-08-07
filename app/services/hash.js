const bcrypt = require("bcrypt");

exports.hashPassword = plainPassword => {
    return bcrypt.hashSync(plainPassword, 10);
};

exports.comparePassword = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};