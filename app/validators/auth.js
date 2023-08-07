const usersModel = require("@models/users");

exports.isPasswordsMatch = (password1, password2) => password1 === password2;

exports.isValidEmail = async newUserEmail => {
    const allEmails = await usersModel.findAll(["email"]);

    const target = await allEmails.map(item => {
        if (item.email === newUserEmail) {
            return true;
        };
    });


    return (target.includes(true)) ? false : true;
};