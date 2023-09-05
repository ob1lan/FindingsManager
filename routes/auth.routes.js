const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const {
  signup,
  signupForm,
  signinForm,
  signin,
  signout,
  otpForm,
  verifyOtp,
  verifyEmail,
  forgotPasswordForm,
  sendResetLink,
  resetPasswordForm,  
  resetPassword,
} = require("../controllers/auth.controller");

router.get("/signup", signupForm);
router.post("/signup", signup);
router.get("/verify-email", verifyEmail);

router.get("/signin", signinForm);
router.post("/signin", signin);
router.get("/signout", ensureAuthenticated, signout);

router.get("/verify-otp", otpForm);
router.post("/verify-otp", verifyOtp);

router.get('/forgot-password', forgotPasswordForm);
router.post('/forgot-password', sendResetLink);
router.get('/reset-password/:token', resetPasswordForm);
router.post('/reset-password/:token', resetPassword);


module.exports = router;
