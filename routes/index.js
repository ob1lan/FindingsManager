const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const auth = require("./auth.routes");
const users = require("./users.routes");
const findings = require("./findings.routes");

router.use("/findings", ensureAuthenticated, findings);
router.use("/users", users);
router.use("/auth", auth);

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
