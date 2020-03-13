const Issue = require("../models/Issue").model;

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
      const { title, description, location } = req.body;

      var files = req.files.map(file => {
        return {
          name: file.originalname,
          size: file.size,
          key: file.key,
          type: file.mimetype,
          url: file.location || ""
        };
      });
      const issue = await Issue.create({
        title,
        description,
        files,
        location: JSON.parse(location)
      });

      return res.send({ issue: issue });
    } catch (err) {
      return res.status(400).send(err);
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
