const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const { uploadAvatar } = require("../config/upload.config");
const meCtrl = require("../controllers/me.controller");
const csrf = require("csurf");
const csrfProtection = csrf();

router.get("/profile", ensureAuthenticated, csrfProtection, meCtrl.userProfile);

router.post(
  "/update/image",
  ensureAuthenticated,
  csrfProtection,
  uploadAvatar.single("avatar"),
  meCtrl.uploadImage
);
router.post(
  "/update/details",
  ensureAuthenticated,
  csrfProtection,
  meCtrl.updateUserDetails
);

router.get(
  "/setup-2fa",
  ensureAuthenticated,
  csrfProtection,
  meCtrl.setup2FAForm
);
router.post(
  "/verify-2fa",
  ensureAuthenticated,
  csrfProtection,
  meCtrl.verify2FA
);
router.post(
  "/disable-2fa",
  ensureAuthenticated,
  csrfProtection,
  meCtrl.disable2FA
);

router.get(
  "/session-expiry",
  ensureAuthenticated,
  csrfProtection,
  (req, res) => {
    const sessionExpiryDate = new Date(req.session.cookie.expires);
    res.json({ expiry: sessionExpiryDate });
  }
);

router.post(
  "/password/update",
  ensureAuthenticated,
  csrfProtection,
  meCtrl.updatePassword
);

module.exports = router;
