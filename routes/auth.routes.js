const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const authController = require("../controllers/auth.controller");
const registrationController = require("../controllers/auth-registration.controller");
const passwordResetController = require("../controllers/auth-reset-password.controller");

router.get("/signup", registrationController.signupForm);
router.post("/signup", registrationController.signup);
router.get("/verify-email", registrationController.verifyEmail);

router.get("/signin", authController.signinForm);
router.post("/signin", authController.signin);
router.get("/signout", ensureAuthenticated, authController.signout);

router.get("/verify-otp", authController.otpForm);
router.post("/verify-otp", authController.verifyOtp);

router.get("/forgot-password", passwordResetController.forgotPasswordForm);
router.post("/forgot-password", passwordResetController.sendResetLink);
router.get("/reset-password/:token", passwordResetController.resetPasswordForm);
router.post("/reset-password/:token", passwordResetController.resetPassword);

module.exports = router;
