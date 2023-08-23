const path = require("path");

module.exports = {
  dbUrl:
    "mongodb+srv://findingsmanager:Secret231434@cluster0.tazgvvj.mongodb.net/findings?retryWrites=true&w=majority",
  cert: path.join(__dirname, "../ssl/local.crt"),
  key: path.join(__dirname, "../ssl/local.key"),
  portHttp: 3000,
  portHttps: 3001,
};
