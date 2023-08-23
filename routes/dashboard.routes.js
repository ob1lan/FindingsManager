const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  dashboard,
} = require("../controllers/dashboard.controller");

router.get("/", ensureAuthenticated, dashboard);

module.exports = router;