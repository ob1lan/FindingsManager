const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const {
  signup,
  signupForm,
  uploadImage,
  userProfile,
  userList,
  profile
} = require("../controllers/users.controller");

router.get("/", userList);
router.get("/profile", profile);
router.get("/:username", userProfile);
router.get("/signup/form", signupForm);
router.post("/signup", signup);
router.post("/update/image", ensureAuthenticated, uploadImage);

module.exports = router;
