const router = require("express").Router();
const {
  ensureAuthenticated,
  ensureAdmin,
  ensure2FAVerified,
  ensureEmailVerified,
} = require("../config/guards.config");
const auth = require("./auth.routes");
const users = require("./users.routes");
const findings = require("./findings.routes");
const admin = require("./admin.routes");
const dashboard = require("./dashboard.routes");

router.use(
  "/findings",
  ensureAuthenticated,
  ensureEmailVerified,
  ensure2FAVerified,
  findings
);
router.use(
  "/dashboard",
  ensureAuthenticated,
  ensureEmailVerified,
  ensure2FAVerified,
  dashboard
);
router.use(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  ensure2FAVerified,
  ensureEmailVerified,
  admin
);
router.use("/users", users);
router.use("/auth", auth);

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
