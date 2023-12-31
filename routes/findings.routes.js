const router = require("express").Router();
const multer = require("multer");
const { ensureAuthenticated } = require("../config/guards.config");
const { uploadCSV } = require("../config/upload.config");
const { uploadAttachment } = require("../config/upload.config");
const fndCtrl = require("../controllers/findings.controller");
const csrf = require("csurf");
const csrfProtection = csrf();

router.get("/", ensureAuthenticated, csrfProtection, fndCtrl.findings);
router.post(
  "/new-finding",
  ensureAuthenticated,
  csrfProtection,
  (req, res, next) => {
    uploadAttachment.single("attachment")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
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
  }
);
router.get(
  "/:id/details",
  ensureAuthenticated,
  csrfProtection,
  fndCtrl.findingDetails
);
router.post(
  "/:id/edit",
  ensureAuthenticated,
  csrfProtection,
  fndCtrl.findingEdit
);
router.post(
  "/:id/delete",
  ensureAuthenticated,
  csrfProtection,
  fndCtrl.findingDelete
);
router.post(
  "/:id/share",
  ensureAuthenticated,
  csrfProtection,
  fndCtrl.findingShare
);
router.get("/export", ensureAuthenticated, csrfProtection, fndCtrl.exportToCSV);
router.post(
  "/import-csv",
  ensureAuthenticated,
  csrfProtection,
  uploadCSV.single("file"),
  fndCtrl.importFindings
);

module.exports = router;
