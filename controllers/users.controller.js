const {
  createUser,
  findUserPerUsername,
  searchUsersPerUsername,
  findUserPerId,
  updateUserDetails,
} = require("../queries/users.queries");
const {
  getFindingsCreatedByUsername,
  getFindingsAssignedToUsername,
} = require("../queries/findings.queries");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/avatars"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.user.username;
    const user = await findUserPerUsername(username);
    const createdFindings = await getFindingsCreatedByUsername(user.username);
    const assignedFindings = await getFindingsAssignedToUsername(user.username);

    if (!user.twoFAEnabled) {
      const secret = speakeasy.generateSecret({ length: 20 });
      const dataURL = await QRCode.toDataURL(secret.otpauth_url);
      res.render("users/profile", {
        username,
        createdFindings,
        assignedFindings,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
        user,
        secret: secret.base32,
        dataURL,
      });
    } else {
      res.render("users/profile", {
        username,
        createdFindings,
        assignedFindings,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
        user,
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.signupForm = (req, res, next) => {
  res.render("users/user-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signup = async (req, res, next) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    res.redirect("/");
  } catch (e) {
    res.render("users/user-registration-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.uploadImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/users/profile");
    } catch (e) {
      next(e);
    }
  },
];

exports.updateUserDetails = async (req, res, next) => {
  try {
    const { firstname, lastname, function: userFunction, bio } = req.body;
    const userId = req.user._id; // Assuming you have user ID in the session
    await updateUserDetails(userId, {
      firstname,
      lastname,
      function: userFunction,
      bio,
    });
    res.redirect("/users/profile");
  } catch (e) {
    next(e);
  }
};

exports.setup2FAForm = async (req, res, next) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const dataURL = await QRCode.toDataURL(secret.otpauth_url);
  res.render("users/setup-2fa", {
    secret: secret.base32,
    dataURL,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.verify2FA = async (req, res, next) => {
  const { otp, secret } = req.body;
  const user = await findUserPerId(req.user._id);
  if (!user) {
    return res.json({ success: false, message: "User not found" });
  }
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: otp,
  });
  if (verified) {
    user.twoFASecret = secret;
    user.twoFAEnabled = true;
    await user.save();
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
};

exports.disable2FA = async (req, res, next) => {
  try {
    req.user.twoFASecret = null;
    req.user.twoFAEnabled = false;
    await req.user.save();
    res.redirect("/users/profile");
  } catch (e) {
    next(e);
  }
};
