const router = require("express").Router();
const {
  ensureAuthenticated,
  ensureAdmin,
  ensure2FAVerified,
  ensureEmailVerified,
} = require("../config/guards.config");
const auth = require("./auth.routes");
const findings = require("./findings.routes");
const dashboard = require("./dashboard.routes");
const me = require("./me.routes");
const admin = require("./admin.routes");

router.use("/auth", auth);

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
  "/me",
  ensureAuthenticated,
  ensure2FAVerified,
  ensureEmailVerified,
  me
);

router.use(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  ensure2FAVerified,
  ensureEmailVerified,
  admin
);

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
