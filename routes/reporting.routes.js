const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");

const {
  generateFindingsReport,
} = require("../controllers/reporting.controller");

router.post("/findings", ensureAuthenticated, generateFindingsReport);

module.exports = router;
