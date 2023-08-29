const router = require("express").Router();
const {
  signinForm,
  signin,
  signout,
  otpForm,
  verifyOtp,
} = require("../controllers/auth.controller");

router.get("/signin/form", signinForm);
router.post("/signin", signin);
router.get("/signout", signout);

router.get("/verify-otp", otpForm);
router.post("/verify-otp", verifyOtp);

module.exports = router;
