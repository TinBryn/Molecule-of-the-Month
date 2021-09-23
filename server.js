
const express = require('express');
const app = express();
const path = require("path");

const enviroment = require("dotenv");
enviroment.config();

app.set("/", "html");
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = parseInt(process.env.PORT || "8080") || 8080

configureRoutes(app);

app.listen(port, () => {
    console.log("listen on http://localhost:" + port);
});

function configureRoutes(app) {
    app.get('/', (_req, res) => {
        res.sendFile(path.join(__dirname, "static", "index.html"));
    });

    app.get('/molecule', (req, res) => {
        res.sendFile(path.join(__dirname, "static", "molecule.html"));
    });

    app.get("/admin/cms", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "cms.html"));
    });
}
