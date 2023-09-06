const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const { uploadAvatar } = require("../config/upload.config");
const meCtrl = require("../controllers/me.controller");

router.get("/profile", ensureAuthenticated, meCtrl.userProfile);

router.post(
  "/update/image",
  ensureAuthenticated,
  uploadAvatar.single("avatar"),
  meCtrl.uploadImage
);
router.post("/update/details", ensureAuthenticated, meCtrl.updateUserDetails);

router.get("/setup-2fa", ensureAuthenticated, meCtrl.setup2FAForm);
router.post("/verify-2fa", ensureAuthenticated, meCtrl.verify2FA);
router.post("/disable-2fa", ensureAuthenticated, meCtrl.disable2FA);

router.get("/session-expiry", ensureAuthenticated, (req, res) => {
  const sessionExpiryDate = new Date(req.session.cookie.expires);
  res.json({ expiry: sessionExpiryDate });
});

router.post("/password/update", ensureAuthenticated, meCtrl.updatePassword);

module.exports = router;
