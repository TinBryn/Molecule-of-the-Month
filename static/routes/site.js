const path = require("path");

module.exports = app => {
    app.get("/", (_request, response) => {
        console.log("landing page");
        response.sendFile(path.join(__dirname, "../templates/index.html"));
    })
    
    app.get("/molecule", (_request, response) => {
        console.log("app page");
        response.sendFile(path.join(__dirname, "../templates/molecule.html"));
    })
    
    app.get("/markerless", (_request, res) => {
        console.log("experimental page");
        response.sendFile(path.join(__dirname, "../templates/markerless.html"));
    })
    
    app.get("/admin/cms", (_request, res) => {
        console.log("CMS page");
        response.sendFile(path.join(__dirname, "../templates/cms.html"));
    });
}
