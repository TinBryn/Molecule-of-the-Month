const passport = require('passport');
const bcrypt = require('bcrypt');
const initializePassport = require("../config/passport-config");
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect();

/**
 * todo @danielgerardclaassen
 */
initializePassport(
    passport,
    email => client.query("SELECT * FROM users WHERE email='$1'", [email], (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            return JSON.stringify(res.rows[0])
        }
    }),
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
    response.redirect('/login')
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
     * The way the file structure queues files is by naming convention. Each file uploaded has a name corresponding to the month and year selected for it.
     */
    app.post('/submit', checkAuthenticated, function (req, res) {
        let sampleFile;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
        var d = String(req.body.time);
        d = d.substring(0, d.length - 3);
        sampleFile = req.files.sampleFile;
        uploadPath = __dirname + '/files/' + d;
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
    app.post('/login', (req, res, next) => {
        checkNotAuthenticated;
        next();
    },
        passport.authenticate('login', {
            successRedirect: '/submit',
            failureRedirect: '/login',
            failureFlash: true
        })
    )

    /**
     * todo @danielgerardclaassen
     */
    app.get('/register', checkNotAuthenticated, (req, res) => {
        res.render('register.ejs')
    })

    /**
     * registered users have their details inserted into heroku database.
     */
    app.post('/register', checkNotAuthenticated, async (req, res) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            client.query('INSERT INTO users(user_id,username,password,email) VALUES($1,$2,$3,$4)', [Date.now().toString(), req.body.name, hashedPassword, req.body.email], (err, res) => {
                if (err) {
                    console.log(err.stack)
                }
            });
            res.redirect('/login')
        } catch {
            res.redirect('/register')
        }
    })

    /**
     * This route is used when users log out.
     * 
     */
    app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/login')
    })

    /**
     * This route will automatically serve the file corresponding to the current month and year only. 
     */
    app.get('/download', function (req, res) {
        var d = new Date();
        var year = String(d.getFullYear())
        var month = String(d.getMonth() + 1)
        var name = String(year + '-' + month)
        const file = __dirname + '/files/' + name;
        res.download(file);
    })
};
