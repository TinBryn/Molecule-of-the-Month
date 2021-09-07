const express = require('express');
const app = express();
const path = require('path');

app.set("/","html");
app.use(express.static(path.join(__dirname,"/")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = parseInt(process.env.PORT || "8080") || 8080


app.get('/',(req,res) => {
    res.render('index');
});

app.listen(port,() => {
    console.log("listen on http://localhost:" + port);
});
