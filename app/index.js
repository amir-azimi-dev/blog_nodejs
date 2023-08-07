require("module-alias/register");
const express = require("express");
const application = express();

require("./bootstrap")(application);

require("@routes")(application);

module.exports = () => {
    const port = process.env.APP_PORT;
    application.listen(port, () => console.log(`running on port ${port} ...`));
};