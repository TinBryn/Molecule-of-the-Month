const bcrypt = require('bcrypt');
const passport = require('passport');
const initializePassport = require('./static/config/passport-config')
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)
const users = []

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

    configureCmsRoutes(app);
}

function configureCmsRoutes(app) {
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
