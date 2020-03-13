require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require("body-parser");

class App {
  constructor() {
    this.express = express();

    this.server = require("http").Server(this.express);

    this.middlewares();
    this.database();
    this.routes();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(morgan("dev"));
    this.express.use("/", express.static(__dirname + "/../public/"));
    this.express.use(
      "/files",
      express.static(__dirname + "/../public/uploads")
    );
    this.express.use(
      "/jquery.min.js",
      express.static(__dirname + "/../node_modules/jquery/dist/jquery.min.js")
    );
  }

  async database() {
    try {
      mongoose.set("useCreateIndex", true);
      const client = await mongoose
        .connect(process.env.MONGO_URL, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })
        .then(() => console.log("Issues -> MongoDB Connected"))
        .catch(err => console.log(err));
    } catch (e) {
      console.log(e);
    }
  }

  routes() {
    this.express.use(routes);
  }
}

module.exports = new App().server;
