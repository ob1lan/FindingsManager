const express = require("express");
const router = express.Router();
const { setup2FA, generateQR, verify2FA } = require("../controllers/2fa.controller");

router.get("/2fa-setup", setup2FA);
router.post("/2fa-verify", verify2FA);
router.get("/generate-qr", generateQR);

module.exports = router;
