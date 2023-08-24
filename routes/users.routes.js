const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  signup,
  signupForm,
  uploadImage,
  userProfile,
  updateUserDetails,
} = require("../controllers/users.controller");

router.get("/profile", userProfile);
router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", ensureAuthenticated, uploadImage);
router.post("/update/details", ensureAuthenticated, updateUserDetails);

module.exports = router;
