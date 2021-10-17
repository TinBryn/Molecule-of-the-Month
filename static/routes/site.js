const path = require("path");

module.exports = app => {
    /**
     * The landing page for the site, contains links to the main parts of the site
     */
    app.get("/", (request, response) => {
        console.log("landing page");
        response.sendFile(path.join(__dirname, "../views/index.html"));
    })
    
    /**
     * The main AR application
     */
    app.get("/molecule", (request, response) => {
        console.log("app page");
        response.sendFile(path.join(__dirname, "../views/molecule.html"));
    })
}
