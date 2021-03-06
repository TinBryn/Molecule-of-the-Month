const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const path = require("path");


const app = express();


app.set("/", "html");
app.use(express.json());
app.set('view-engine', 'ejs');
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// connections below are used in fileuploading
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload())
app.use(methodOverride('_method'))


module.exports = app;
