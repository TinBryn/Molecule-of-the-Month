const express = require('express');
const app = express();
const path = require("path");
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const initializePassport = require('./passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = []

const enviroment = require("dotenv");
enviroment.config();

//Debug
const {
    readFileSync
} = require('fs');


// get the port from the deployment environment or use 8080 as default
const port = parseInt(process.env.PORT || "8080") || 8080;

// get the database url from the deployment environment
const dbUrl = process.env.DATABASE_URL;

configureRoutes(app);

app.listen(port, () => {
    console.log("listen on http://localhost:" + port);
});

function configureRoutes(app) {
    app.set("/", "html");
    app.use(express.static(path.join(__dirname, "static")));
    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    app.set('view-engine', 'ejs')
    app.use(express.urlencoded({
        extended: false
    }))
    app.use(flash())
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    app.use(passport.initialize())
    app.use(passport.session())
    app.use(methodOverride('_method'))
    app.use(fileUpload())
    app.get('/', (_req, res) => {
        res.sendFile(path.join(__dirname, "static", "templates/index.html"));
    });

    app.get('/molecule', (req, res) => {
        res.sendFile(path.join(__dirname, "static", "templates/molecule.html"));
    });

    app.get("/markerless", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "templates/markerless.html"));
    })

    app.get("/admin/cms", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "templates/cms.html"));
    });

    app.get('/api/todo', async (req, res) => {

        const pdbConverter = require('./conversion/pdbtomoleculeconverter.js');
        const gltfConverter = require('./conversion/moleculetogltfconverter.js');
        //Fetch PDB from database string in the future
        let pdbPath = path.join(__dirname, "static", `/examples/${process.env.MOLECULEPDB}`);
        let outputPath = path.join(__dirname, "static", `/molfile/molecule.gltf`);
        let pdbString = readFileSync(pdbPath, 'utf8');
        let atomData = pdbConverter.parsePdbString(pdbString);
        //GLTF file is generated per request so pretty costly
        //Need to wait for the getBallAndStick function to return before sending
        let gltfFile = await gltfConverter.getBallAndStick(atomData);
        res.send(gltfFile);
    });

    app.get("/api/molecule", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "molfile", "molecule.gltf"));
    });

    app.get("/api/molecule_ar", (req, res) => {
        res.sendFile(path.join(__dirname, "static", "molfile", "dna1.usdz"));
    });

    // The below HTTP methods are used in the simple CMS app
    // the /submit route is used to upload files. Only accessible by authorised users. 
    app.get('/submit', checkAuthenticated, (req, res) => {
        res.render('submit.ejs', {
            name: req.user.name
        })
    })

    app.post('/submit', checkAuthenticated, function (req, res) {
        let sampleFile;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        sampleFile = req.files.sampleFile;
        uploadPath = __dirname + '/files/' + sampleFile.name;
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return res.status(500).send(err);

            res.send('File uploaded.');
        });
    });

    app.get('/login', checkNotAuthenticated, (req, res) => {
        res.render('login.ejs')
    })

    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/submit',
        failureRedirect: '/login',
        failureFlash: true
    }))

    app.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register.ejs')
    })

    app.post('/register', checkNotAuthenticated, async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            res.redirect('/login')
        } catch {
            res.redirect('/register')
        }
        console.log(users)
    })

    // This route is used when users log out.
    app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })
}

// These next two functions check respectively if the user is Authenticated/logged in or not.
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/submit')
    }
    next()
}