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
    email => client.query("SELECT * FROM users WHERE email='$1'", [email], (error, result) => {
        if (error) {
            console.log(error.stack)
        } else {
            return JSON.stringify(result.rows[0])
        }
    }),
);


/**
 * Check if the user is Authenticated/logged in
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
function checkAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return next()
    }
    response.redirect('/login')
}

/**
 * Check if the user is not Authenticated/logged in
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
function checkNotAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return response.redirect('/submit')
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
     * @param {*} request
     * @param {*} response
     */
    app.get('/submit', checkAuthenticated, (request, response) => {
        response.render('submit.ejs', {
            name: request.user.name
        })
    })
    
    /**
     * The way the file structure queues files is by naming convention. Each file uploaded has a name corresponding to the month and year selected for it.
     */
    app.post('/submit', checkAuthenticated, function (request, response) {
        let sampleFile;
        let uploadPath;
        if (!request.files || Object.keys(request.files).length === 0) {
            return response.status(400).send('No files were uploaded.');
        }
        var d = String(request.body.time);
        d = d.substring(0, d.length - 3);
        sampleFile = request.files.sampleFile;
        uploadPath = __dirname + '/files/' + d;
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return response.status(500).send(err);
            response.send('File uploaded.');
        });
    });

    /**
     * todo @danielgerardclaassen
     */
    app.get('/login', checkNotAuthenticated, (request, response) => {
        response.render('login.ejs')
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
    app.get('/register', checkNotAuthenticated, (request, response) => {
        response.render('register.ejs')
    })

    /**
     * registered users have their details inserted into heroku database.
     */
    app.post('/register', checkNotAuthenticated, async (request, response) => {
        try {
            const hashedPassword = await bcrypt.hash(request.body.password, 10);
            client.query('INSERT INTO users(user_id,username,password,email) VALUES($1,$2,$3,$4)', [Date.now().toString(), request.body.name, hashedPassword, request.body.email], (err, res) => {
                if (err) {
                    console.log(err.stack)
                }
            });
            response.redirect('/login')
        } catch {
            response.redirect('/register')
        }
    })

    /**
     * This route is used when users log out.
     * 
     */
    app.delete('/logout', (request, response) => {
        request.logOut()
        response.redirect('/login')
    })

    /**
     * This route will automatically serve the file corresponding to the current month and year only. 
     */
    app.get('/download', function (request, response) {
        var d = new Date();
        var year = String(d.getFullYear())
        var month = String(d.getMonth() + 1)
        var name = String(year + '-' + month)
        const file = __dirname + '/files/' + name;
        response.download(file);
    })
};
