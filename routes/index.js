const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const auth = require("./auth.routes");
const users = require("./users.routes");
const findings = require("./findings.routes");
const admin = require("./admin.routes");
const dashboard = require("./dashboard.routes");
const twofa = require("./2fa.routes");


router.use("/findings", ensureAuthenticated, findings);
router.use("/dashboard", ensureAuthenticated, dashboard);
router.use("/admin", ensureAuthenticated, ensureAdmin, admin);
router.use("/users", users);
router.use("/auth", auth);
router.use("/2fa", ensureAuthenticated, twofa)

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
