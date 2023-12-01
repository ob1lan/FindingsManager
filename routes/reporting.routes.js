const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");

const {
  generateFindingsReport,
  generateMultipleFindingsReport,
} = require("../controllers/reporting.controller");

router.post("/findings", ensureAuthenticated, generateFindingsReport);

router.post(
  "/multiple-findings",
  ensureAuthenticated,
  generateMultipleFindingsReport
);

module.exports = router;
