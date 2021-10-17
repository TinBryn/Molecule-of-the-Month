const passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require("../config/passport-config");
/**
 * A structure containing the registered users
 * 
 * @todo this should be stored in a database for persistance
 */
const users = [];
initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
);


/**
 * Check if the user is Authenticated/logged in
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

/**
 * Check if the user is not Authenticated/logged in
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/submit')
    }
    next()
}

/**
 * The below HTTP methods are used in the simple CMS app
 * 
 * @param {Express} app The web application these will be added to.
 */
module.exports = app => {
    /**
     * the /submit route is used to upload files. Only accessible by authorised users. 
     * 
     */
    app.get('/submit', checkAuthenticated, (req, res) => {
        res.render('submit.ejs', {
            name: req.user.name
        })
    })

    /**
     * todo @danielgerardclaassen
     */
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

    /**
     * todo @danielgerardclaassen
     */
    app.get('/login', checkNotAuthenticated, (req, res) => {
        res.render('login.ejs')
    })

    /**
     * todo @danielgerardclaassen
     */
    app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
        successRedirect: '/submit',
        failureRedirect: '/login',
        failureFlash: true
    }))

    /**
     * todo @danielgerardclaassen
     */
    app.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register.ejs')
    })

    /**
     * todo @danielgerardclaassen
     */
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

    /**
     * This route is used when users log out.
     * 
     */
    app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })
};
