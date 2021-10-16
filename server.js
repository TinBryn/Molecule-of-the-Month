const enviroment = require("dotenv");
enviroment.config();

// get the port from the deployment environment or use 8080 as default
const port = normalizePort(process.env.PORT || "8080");

const app = require("./app");

app.set("port", port);

// get the database url from the deployment environment
const dbUrl = process.env.DATABASE_URL;

configureRoutes(app);

app.listen(port, () => {
    console.log("listen on http://localhost:" + port);
});

function configureRoutes(app) {

    const siteRouter = require("./static/routes/site");
    siteRouter(app);

    const apiRouter = require("./static/routes/api");
    apiRouter(app);

    const cmsRouter = require("./static/routes/cms");
    cmsRouter(app);
}


/**
 ** Normalize a port into a number, string, or false.
 **/
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
