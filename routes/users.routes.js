const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  signup,
  signupForm,
  uploadImage,
  userProfile,
  updateUserDetails,
  setup2FAForm,
  verify2FA,
  disable2FA,
} = require("../controllers/users.controller");

router.get("/profile", ensureAuthenticated, userProfile);
router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", ensureAuthenticated, uploadImage);
router.post("/update/details", ensureAuthenticated, updateUserDetails);

router.get("/setup-2fa", ensureAuthenticated, setup2FAForm);
router.post("/verify-2fa", ensureAuthenticated, verify2FA);
router.post("/disable-2fa", ensureAuthenticated, disable2FA);

//- To be moved to /me/ later
router.get("/session-expiry", ensureAuthenticated, (req, res) => {
  const sessionExpiryDate = new Date(req.session.cookie.expires);
  res.json({ expiry: sessionExpiryDate });
});

module.exports = router;
