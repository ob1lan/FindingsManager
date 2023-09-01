const {
  createUser,
  findUserPerUsername,
  findUserPerId,
  updateUserDetails,
  findLastFiveLogsByEmail,
} = require("../queries/users.queries");

const {
  getFindingsCreatedByUsername,
  getFindingsAssignedToUsername,
} = require("../queries/findings.queries");

const authLog = require("../database/models/authLog.model");

const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const path = require("path");
const bcrypt = require("bcrypt");
const { uploadAvatar } = require("../config/upload.config");

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.user.username;
    const user = await findUserPerUsername(username);
    const createdFindings = await getFindingsCreatedByUsername(user.username);
    const assignedFindings = await getFindingsAssignedToUsername(user.username);
    const logs = (await findLastFiveLogsByEmail(req.user.local.email)) || [];
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const dayName = days[date.getUTCDay()];
      const monthName = months[date.getUTCMonth()];
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      const seconds = String(date.getUTCSeconds()).padStart(2, "0");
      const offset = -date.getTimezoneOffset() / 60;
      const timezone = `GMT${offset >= 0 ? "+" : "-"}${Math.abs(offset)
        .toString()
        .padStart(2, "0")}00`;
      log.formattedTimestamp = `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds} ${timezone}`;
    });

    if (!user.twoFAEnabled) {
      const secret = speakeasy.generateSecret({ length: 20 });
      const dataURL = await QRCode.toDataURL(secret.otpauth_url);
      res.render("users/profile", {
        username,
        createdFindings,
        assignedFindings,
        logs,
        isAuthenticated: req.isAuthenticated(),
        is2FAVerified: req.session.is2FAVerified,
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
        logs,
        isAuthenticated: req.isAuthenticated(),
        is2FAVerified: req.session.is2FAVerified,
        currentUser: req.user,
        user,
      });
    }
  } catch (e) {
    next(e);
  }
};

exports.signupForm = (req, res, next) => {
  res.render("users/user-registration-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    is2FAVerified: req.session.is2FAVerified,
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
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.uploadImage = [
  uploadAvatar.single("avatar"),
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
    is2FAVerified: req.session.is2FAVerified,
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

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await findUserPerId(req.user._id);

    // Check if current password is correct
    if (!bcrypt.compareSync(currentPassword, user.local.password)) {
      const log = new authLog({
        attemptedEmail: user.local.email,
        attemptedAction: "password-change",
        userAgent: req.headers["user-agent"],
        clientIP: req.ip,
        status: "failed",
      });
      await log.save();
      // Handle error: Current password is incorrect
      return res.status(400).send("Current password is incorrect");
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      // Handle error: Passwords do not match
      return res.status(400).send("Passwords do not match");
    }

    // Hash the new password and save
    user.local.password = bcrypt.hashSync(newPassword, 10);
    await user.save();

    const log = new authLog({
      attemptedEmail: user.local.email,
      attemptedAction: "password-change",
      userAgent: req.headers["user-agent"],
      clientIP: req.ip,
      status: "success",
    });
    await log.save();
    
    res.redirect("/users/profile"); // Redirect to profile or any other page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
