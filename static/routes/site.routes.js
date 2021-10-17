const { index, molecule } = require("../controllers/site.controller");

/**
 * Main pages for the site
 * 
 * @param {Express} app 
 */
module.exports = app => {
    app.get("/", index);
    app.get("/molecule", molecule);
}
