const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin, ensure2FAVerified } = require("../config/guards.config");
const auth = require("./auth.routes");
const users = require("./users.routes");
const findings = require("./findings.routes");
const admin = require("./admin.routes");
const dashboard = require("./dashboard.routes");

router.use("/findings", ensureAuthenticated, ensure2FAVerified, findings);
router.use("/dashboard", ensureAuthenticated, ensure2FAVerified, dashboard);
router.use("/admin", ensureAuthenticated, ensureAdmin, ensure2FAVerified, admin);
router.use("/users", ensure2FAVerified, users);
router.use("/auth", auth);

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
