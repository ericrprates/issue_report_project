const routes = require("express").Router();
const IssueController = require("./controllers/IssueController");

routes.get("/issues", IssueController.index);
routes.get("/issues/:id", IssueController.show);
routes.post("/issues", IssueController.create);

module.exports = routes;
