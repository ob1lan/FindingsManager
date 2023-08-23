const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const users = require("./users.routes");
const auth = require("./auth.routes");
const dashboard = require("./dashboard.routes");

router.use("/dashboard", ensureAuthenticated, dashboard);
router.use("/users", users);
router.use("/auth", auth);

router.get("/", (req, res) => {
  res.redirect("/dashboard");
});

module.exports = router;
