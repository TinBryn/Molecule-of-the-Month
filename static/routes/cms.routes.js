const {
    checkAuthenticated,
    checkNotAuthenticated,
    passport,
    getSubmit,
    postSubmit,
    getLogin,
    getRegister,
    postRegister,
    deleteLogout,
    getDownload,
} = require("../controllers/cms.controller");

/**
 * The below HTTP methods are used in the simple CMS app
 * 
 * @param {Express} app The web application these will be added to.
 */
module.exports = app => {
    app.get('/submit', checkAuthenticated, getSubmit)
    app.post('/submit', checkAuthenticated, postSubmit);
    app.get('/login', checkNotAuthenticated, getLogin)

    /**
     * todo @danielgerardclaassen
     * 
     * @param {Request} request
     * @param {Response} response
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

    app.get('/register', checkNotAuthenticated, getRegister)
    app.post('/register', checkNotAuthenticated, postRegister)
    app.delete('/logout', deleteLogout)
    app.get('/download', getDownload)
};
