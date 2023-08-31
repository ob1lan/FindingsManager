const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const {
  signinForm,
  signin,
  signout,
  otpForm,
  verifyOtp,
  viewAllLoginLogs,
  viewUserLoginLogs,
} = require("../controllers/auth.controller");

router.get("/signin/form", signinForm);
router.post("/signin", signin);
router.get("/signout", ensureAuthenticated, signout);

router.get("/verify-otp", otpForm);
router.post("/verify-otp", verifyOtp);

router.get("/admin/login-logs", ensureAdmin, viewAllLoginLogs);
router.get("/user/login-logs", ensureAuthenticated, viewUserLoginLogs);

module.exports = router;
