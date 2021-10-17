const { todo, molecule } = require("../controllers/api.controller");

module.exports = (app) => {
    app.get('/api/todo', todo);
    app.get("/api/molecule", molecule);
}