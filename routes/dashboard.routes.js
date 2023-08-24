const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  dashboard,
  findingCreate,
} = require("../controllers/dashboard.controller");

router.get("/", ensureAuthenticated, dashboard);
router.post("/new-finding", ensureAuthenticated, findingCreate);


module.exports = router;