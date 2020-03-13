const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const IssueController = require("./controllers/IssueController");

//Serves all the request which includes /images in the url from Images folder

routes.get("/issues", IssueController.index);
routes.get("/issues/:id", IssueController.show);
routes.post(
  "/issues",
  multer(multerConfig).array("files[]"),
  IssueController.create
);

module.exports = routes;
