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

//Remove this later
const getter = require('./convertor/moleculegetter.js');
//const convertor = require('./convertor/convertor.js');

app.get('/',(req,res) => {
    res.render('index');
});

app.listen(port,() => {
    console.log("listen on http://localhost:" + port);
    const data = getter.getMoleculeOfTheMonth();
    //convertor.parsePdbFile(data);
});
