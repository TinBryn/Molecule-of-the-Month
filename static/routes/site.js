const path = require("path");

module.exports = app => {
    /**
     * The landing page for the site, contains links to the main parts of the site
     */
    app.get("/", (_request, response) => {
        console.log("landing page");
        response.sendFile(path.join(__dirname, "../views/index.html"));
    })
    
    /**
     * The main AR application
     */
    app.get("/molecule", (_request, response) => {
        console.log("app page");
        response.sendFile(path.join(__dirname, "../views/molecule.html"));
    })
    
    /**
     * The CMS functionality so an admin can schedule which molecules will be displayed
     */
    app.get("/admin/cms", (_request, res) => {
        console.log("CMS page");
        response.sendFile(path.join(__dirname, "../views/cms.html"));
    });
}
