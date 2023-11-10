const router = require("express").Router();
const multer = require("multer");
const { ensureAuthenticated } = require("../config/guards.config");
const { uploadCSV } = require("../config/upload.config");
const { uploadAttachment } = require("../config/upload.config");
const fndCtrl = require("../controllers/findings.controller");

router.get("/", ensureAuthenticated, fndCtrl.findings);
router.post("/new-finding", ensureAuthenticated, (req, res, next) => {
  uploadAttachment.single("attachment")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({
            message:
              "File too large. Please upload a file smaller than the specified limit (5MB).",
          });
      }
    } else if (err) {
      return res
        .status(500)
        .json({ message: "An error occurred during the file upload." });
    }
    fndCtrl.findingCreate(req, res);
  });
});
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
