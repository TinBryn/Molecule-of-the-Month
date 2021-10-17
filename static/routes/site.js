const path = require("path");

/**
 * Main pages for the site
 * 
 * @param {Express} app 
 */
module.exports = app => {
    /**
     * The landing page for the site, contains links to the main parts of the site
     * 
     * @param {Request} request
     * @param {Response} response
     */
    app.get("/", (request, response) => {
        console.log("landing page");
        response.sendFile(path.join(__dirname, "../views/index.html"));
    })
    
    /**
     * The main AR application
     * 
     * @param {Request} request
     * @param {Response} response
     */
    app.get("/molecule", (request, response) => {
        console.log("app page");
        response.sendFile(path.join(__dirname, "../views/molecule.html"));
    })
}
