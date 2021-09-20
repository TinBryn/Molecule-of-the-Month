
const express = require('express');
const app = express();
const path = require('path');

const enviroment = require('dotenv');
enviroment.config();

app.set("/","html");
app.use(express.static(path.join(__dirname,"static")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = parseInt(process.env.PORT || "8080") || 8080

const convertor = require('./convertor/convertor.js');
const render = require('./convertor/moleculerenderer.js');

app.get('/',(req,res) => {
    res.render('index');
});

app.listen(port,() => {
    const atomData = convertor.parsePdbFile('./convertor/debug/CdTe.pdb');
    render.renderMolecule(atomData);
    console.log("listen on http://localhost:" + port);
});
