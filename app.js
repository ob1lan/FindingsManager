const express = require("express");
const morganBody = require("morgan-body");
const path = require("path");
const index = require("./routes");
const errorHandler = require("errorhandler");
const fileupload = require("express-fileupload");
require("./database");

const app = express();
module.exports = app;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

require("./config/session.config");
require("./config/passport.config");

// hook morganBody to express app
morganBody(app);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(index);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
} else {
  app.use((err, req, res, next) => {
    const code = err.code || 500;
    res.status(code).json({
      code: code,
      message: code === 500 ? null : err.message,
    });
  });
}
