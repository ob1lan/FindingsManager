const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  findings,
  findingCreate,
  findingDetails,
  findingEdit,
  findingDelete,
  exportToCSV,
} = require("../controllers/findings.controller");

router.get("/", ensureAuthenticated, findings);
router.post("/new-finding", ensureAuthenticated, findingCreate);
router.get("/:id/details", ensureAuthenticated, findingDetails);
router.post("/:id/edit", ensureAuthenticated, findingEdit);
router.post("/:id/delete", ensureAuthenticated, findingDelete);
router.get("/export", ensureAuthenticated, exportToCSV);

module.exports = router;