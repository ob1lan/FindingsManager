const router = require("express").Router();
const csrf = require("csurf");
const csrfProtection = csrf();
const { ensureAuthenticated } = require("../config/guards.config");
const authController = require("../controllers/auth.controller");
const registrationController = require("../controllers/auth-registration.controller");
const passwordResetController = require("../controllers/auth-reset-password.controller");

router.post("/signup", csrfProtection, registrationController.signup);
router.get("/verify-email", csrfProtection, registrationController.verifyEmail);

router.get("/signin", csrfProtection, authController.signinForm);
router.post("/signin", csrfProtection, authController.signin);
router.get(
  "/signout",
  ensureAuthenticated,
  csrfProtection,
  authController.signout
);

router.get("/verify-otp", csrfProtection, authController.otpForm);
router.post("/verify-otp", csrfProtection, authController.verifyOtp);

router.get(
  "/forgot-password",
  csrfProtection,
  passwordResetController.forgotPasswordForm
);
router.post(
  "/forgot-password",
  csrfProtection,
  passwordResetController.sendResetLink
);
router.get(
  "/reset-password/:token",
  csrfProtection,
  passwordResetController.resetPasswordForm
);
router.post(
  "/reset-password/:token",
  csrfProtection,
  passwordResetController.resetPassword
);

module.exports = router;
