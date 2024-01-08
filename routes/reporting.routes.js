const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const csrf = require("csurf");
const csrfProtection = csrf();

const {
  generateFindingsReport,
  generateMultipleFindingsReport,
} = require("../controllers/reporting.controller");

router.post(
  "/findings",
  ensureAuthenticated,
  csrfProtection,
  generateFindingsReport
);

router.post(
  "/multiple-findings",
  ensureAuthenticated,
  csrfProtection,
  generateMultipleFindingsReport
);

module.exports = router;
