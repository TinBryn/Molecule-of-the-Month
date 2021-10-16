const enviroment = require("dotenv");
enviroment.config();

// get the port from the deployment environment or use 8080 as default
const port = normalizePort(process.env.PORT || "8080");
// get the database url from the deployment environment
const dbUrl = process.env.DATABASE_URL;


const app = require("./app");
app.set("port", port);

const siteRouter = require("./static/routes/site");
const apiRouter = require("./static/routes/api");
const cmsRouter = require("./static/routes/cms");
siteRouter(app);
apiRouter(app);
cmsRouter(app);

app.listen(port, () => {
    console.log("listen on http://localhost:" + port);
});

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
