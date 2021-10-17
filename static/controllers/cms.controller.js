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
 * 
 * @param {Request} request
 * @param {Response} response
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
 * todo @danielgerardclaassen returns and what `next` is
 * 
 * @param {Request} request 
 * @param {Response} response 
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
 * todo @danielgerardclaassen returns and what `next` is
 * 
 * @param {Request} request 
 * @param {Response} response 
 * @param {*} next 
 * @returns 
 */
function checkNotAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return response.redirect('/submit')
    }
    next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    passport,
    bcrypt,
    client
}