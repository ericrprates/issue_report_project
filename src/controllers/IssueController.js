const Issue = require("../models/Issue").model;
const path = require("path");
const fs = require("fs");

class IssueController {
  async index(req, res) {
    try {
      if (!req.query.search) {
        const issues = await Issue.find({}, null, {
          sort: { createdAt: -1 }
        });
        return res.json(issues);
      } else {
        const issues = await Issue.find(
          { $text: { $search: req.query.search } },
          null,
          { sort: { createdAt: -1 } }
        );
        return res.status(201).send({ success: true });
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async show(req, res) {
    try {
      if (req.params.id) {
        return res.json(await Issue.findById(req.params.id));
      } else {
        return res.status(400).send("Invalid ID");
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  }

  async create(req, res) {
    try {
      const { title, description, location, file } = req.body;

      // to declare some path to store your converted image
      const type = file.substring(
        "data:image/".length,
        file.indexOf(";base64")
      );
      const now = Date.now();
      const pathB = path.resolve("public", "uploads") + "/" + now + "." + type;

      // to convert base64 format into random filename
      const base64Data = file.replace(/^data:([A-Za-z-+/]+);base64,/, "");

      fs.writeFileSync(pathB, base64Data, { encoding: "base64" });

      var files = {
        name: now + ".jpg",
        url: process.env.APP_URL + "/files/" + now + "." + type
      };

      const issue = await Issue.create({
        title,
        description,
        files,
        location
      });

      return res.send({ issue: issue });
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  }

  async delete(req, res) {
    try {
      const issue = await Issue.findById(req.params.id);
      if (issue.user == req.userId) await issue.remove();
      else return res.status(400).send({ error: "Issue not belongs to user" });
      return res.send();
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}

module.exports = new IssueController();
