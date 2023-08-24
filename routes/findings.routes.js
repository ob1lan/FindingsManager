const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  findings,
  findingCreate,
} = require("../controllers/findings.controller");

router.get("/", ensureAuthenticated, findings);
router.post("/new-finding", ensureAuthenticated, findingCreate);


module.exports = router;