const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("./config/multer");

const IssueController = require("./controllers/IssueController");

//Serves all the request which includes /images in the url from Images folder

routes.get("/issues", IssueController.index);
routes.get("/issues/:id", IssueController.show);
routes.post("/issues", multer(multerConfig).array("file", 3), (req, res) => {
  console.log("file", req.files);
  console.log("body", req.body);
  res.status(200).json({
    message: "success!"
  });
});

module.exports = routes;
