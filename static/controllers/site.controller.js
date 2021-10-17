const path = require("path");

/**
 * The landing page for the site, contains links to the main parts of the site
 * 
 * @param {Request} request
 * @param {Response} response
 */
const index = (request, response) => {
    console.log("landing page");
    response.sendFile(path.join(__dirname, "../views/index.html"));
};

/**
 * The main AR application
 * 
 * @param {Request} request
 * @param {Response} response
 */
const molecule = (request, response) => {
    console.log("app page");
    response.sendFile(path.join(__dirname, "../views/molecule.html"));
};

module.exports = {
    index: index,
    molecule: molecule,
}
