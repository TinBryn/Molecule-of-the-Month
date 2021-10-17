const { molecule } = require("../controllers/api.controller");

module.exports = (app) => {
    app.get("/api/molecule", molecule);
}