const gravatar = require("gravatar");

exports.gravatar = (userEmail, options = "null") => {
    return gravatar.url(userEmail, options);
};