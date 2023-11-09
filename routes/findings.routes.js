const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const { uploadCSV } = require("../config/upload.config");
const { uploadAttachment } = require("../config/upload.config");
const fndCtrl = require("../controllers/findings.controller");

router.get("/", ensureAuthenticated, fndCtrl.findings);
router.post("/new-finding", ensureAuthenticated, uploadAttachment.single("file"), fndCtrl.findingCreate);
router.get("/:id/details", ensureAuthenticated, fndCtrl.findingDetails);
router.post("/:id/edit", ensureAuthenticated, fndCtrl.findingEdit);
router.post("/:id/delete", ensureAuthenticated, fndCtrl.findingDelete);
router.get("/export", ensureAuthenticated, fndCtrl.exportToCSV);
router.post(
  "/import-csv",
  ensureAuthenticated,
  uploadCSV.single("file"),
  fndCtrl.importFindings
);

module.exports = router;
