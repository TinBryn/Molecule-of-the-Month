
const express = require('express');
const app = express();
const path = require("path");

const enviroment = require("dotenv");
enviroment.config();

app.set("/", "html");
app.use(express.static(path.join(__dirname, "static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// get the port from the deployment environment or use 8080 as default
const port = parseInt(process.env.PORT || "8080") || 8080;

// get the database url from the deployment environment
const dbUrl = process.env.DATABASE_URL;

const convertor = require('./convertor/convertor.js');
const render = require('./convertor/moleculegltfconvertor.js');



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

    app.get("/api/molecule", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "molfile", "dna1.gltf"));
    });
}
