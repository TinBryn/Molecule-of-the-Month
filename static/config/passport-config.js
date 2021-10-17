// These constants define how passport-local and bcrypt are used specifically. Defining a 'LocalStrategy'.
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {Client} = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})
//Open connection to heroku database using details above
client.connect();

let accData = []
//Functions here are exported to be used in cms.js.
module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    passport.use('login', new LocalStrategy({
        usernameField : 'email',
        passReqToCallback : true
    },
    //The below function is the function used to check if the login details match a user in the database.
    function(req, email, password, done) {
        loginUser()
        async function loginUser() {
            try {
                var accData = JSON.stringify(client.query('SELECT user_id, "username", "password" FROM "users" WHERE "email"=$1', [email], (err, result) => {
                    if (err) {
                        return done(err);
                    }
                    if (result.rows[0] == null) {
                        return done(null, false, req.flash('No user with that email'));
                    } else {
                        bcrypt.compare(password, result.rows[0].password, (err, valid) => {
                            if (err) {
                                return done(null, false, req.flash('Invalid Password'));
                            }
                            if (valid) {
                                return done(null, { email: result.rows[0].email });
                            } else {
                                return done(null, false, req.flash("Incorrect username or password"));
                            }
                        });
                    }
                }))
            }
            catch (e) {
                throw (e)
            }
        }
    }
    ))
}