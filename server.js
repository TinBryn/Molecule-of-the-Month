const enviroment = require("dotenv");
enviroment.config();

// get the port from the deployment environment or use 8080 as default
const port = normalizePort(process.env.PORT || "8080");
// get the database url from the deployment environment
const databaseUrl = process.env.DATABASE_URL;


const app = require("./app");
app.set("port", port);

const enableSite = process.env.BAYLISS_FEATURE_SITE == "true";

if (enableSite) {
    const siteRouter = require("./static/routes/site.routes");
    siteRouter(app);
}

const enableApi = process.env.BAYLISS_FEATURE_API == "true";

if (enableApi) {
    const apiRouter = require("./static/routes/api.routes");
    apiRouter(app);
}

const enableCms = process.env.BAYLISS_FEATURE_CMS == "true";

if (enableCms) {
    const cmsRouter = require("./static/routes/cms");
    cmsRouter(app);
}

app.listen(port, () => {
    console.log("listen on http://localhost:" + port);
});

/**
 * Normalize a port
 * 
 * @param {string} port: the string that represents the port 
 * @returns if the port parses into a number in base 10, that number is returned
 *          if the port parses into NaN, then the original string is returned
 *          otherwise `false` is returned
 */
function normalizePort(port) {
    var port = parseInt(port, 10);

    if (isNaN(port)) {
        // named pipe
        return port;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
