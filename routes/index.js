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
const reporting = require("./reporting.routes");
const projects = require("./projects.routes");

router.use("/auth", auth);

router.use(
  "/findings",
  ensureAuthenticated,
  ensure2FAVerified,
  findings
);

router.use(
  "/dashboard",
  ensureAuthenticated,
  ensure2FAVerified,
  dashboard
);

router.use(
  "/me",
  ensureAuthenticated,
  ensure2FAVerified,
  me
);

router.use(
  "/admin",
  ensureAuthenticated,
  ensureAdmin,
  ensure2FAVerified,
  admin
);

router.use(
  "/projects",
  ensureAuthenticated,
  ensure2FAVerified,
  projects
);

router.use("/reporting", ensureAuthenticated, ensure2FAVerified, reporting);

router.get("/", (req, res) => {
  res.redirect("/findings");
});

module.exports = router;
