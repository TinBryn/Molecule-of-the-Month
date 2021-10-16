// These constants define how passport-local and bcrypt are used specifically. Defining a 'LocalStrategy'.
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// The initialize function is used to crosscheck whether login details are correct. The purpose is to skip the handshaking that would occur if we were to not use passport. This compares against hashed passwords.
function initialize(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password Inccorect' })
            }
        } catch (e) {
            return done(e)
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize