const express = require("express");
const router = express.Router();
const {
  getDashboard,
  generateOverdueFindingsReport,
} = require("../controllers/dashboard.controller");

router.get("/", getDashboard);
router.get("/generate-overdue-report", generateOverdueFindingsReport);

module.exports = router;
