const fs = require("fs");
const path = require("path");
const sanitize = require("mongo-sanitize");
const {
  createUser,
  findUserPerUsername,
  findUserPerId,
  updateUserDetails,
  findLast50LogsByEmail,
} = require("../queries/users.queries");

const {
  getFindingsCreatedByUsername,
  getFindingsAssignedToUsername,
} = require("../queries/findings.queries");

const authLog = require("../database/models/authLog.model");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");
const { uploadAvatar } = require("../config/upload.config");

exports.userProfile = async (req, res, next) => {
  try {
    const username = sanitize(String(req.user.username));
    const user = await findUserPerUsername(username);
    const createdFindings = await getFindingsCreatedByUsername(user.username);
    const assignedFindings = await getFindingsAssignedToUsername(user.username);
    const logs = (await findLast50LogsByEmail(req.user.local.email)) || [];
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

exports.uploadImage = [
  uploadAvatar.single("avatar"),
  async (req, res, next) => {
    try {
      const user = sanitize(String(req.user));
      const defaultAvatarPath = "/images/default-profile.svg";

      // Check if current avatar is not the default avatar
      if (user.avatar && user.avatar !== defaultAvatarPath) {
        // Construct the full path to the current avatar file
        const currentAvatarFullPath = path.join(
          __dirname,
          "..",
          "public",
          user.avatar
        );

        // Delete the current avatar file
        fs.unlink(currentAvatarFullPath, (err) => {
          if (err) {
            console.error("Error deleting old avatar:", err);
          }
        });
      }

      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/me/profile");
    } catch (e) {
      next(e);
    }
  },
];

exports.updateUserDetails = async (req, res, next) => {
  try {
    await updateUserDetails(req.user._id, req.body);
    res.redirect("/me/profile");
  } catch (e) {
    next(e);
  }
};

exports.setup2FAForm = async (req, res, next) => {
  const secret = speakeasy.generateSecret({ length: 20 });
  const dataURL = await QRCode.toDataURL(secret.otpauth_url);
  res.render("me/setup-2fa", {
    secret: secret.base32,
    dataURL,
    isAuthenticated: req.isAuthenticated(),
    is2FAVerified: req.session.is2FAVerified,
    currentUser: req.user,
  });
};

exports.verify2FA = async (req, res, next) => {
  const otp = sanitize(String(req.body.otp));
  const secret = sanitize(String(req.body.secret));
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
    const log = new authLog({
      attemptedEmail: sanitize(String(req.user.local.email)),
      attemptedAction: "2FAenabled",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "success",
    });
    log.save();
    user.twoFASecret = secret;
    user.twoFAEnabled = true;
    await user.save();
    res.json({ success: true });
  } else {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.user.local.email)),
      attemptedAction: "2FAenabled",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "failed",
    });
    log.save();
    res.json({ success: false });
  }
};

exports.disable2FA = async (req, res, next) => {
  try {
    req.user.twoFASecret = null;
    req.user.twoFAEnabled = false;
    await req.user.save();
    const log = new authLog({
      attemptedEmail: sanitize(String(req.user.local.email)),
      attemptedAction: "2FAdisabled",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "success",
    });
    log.save();
    res.redirect("/me/profile");
  } catch (e) {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.user.local.email)),
      attemptedAction: "2FAdisabled",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "failed",
    });
    log.save();
    next(e);
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const currentPassword = sanitize(String(req.body.currentPassword));
    const newPassword = sanitize(String(req.body.newPassword));
    const confirmPassword = sanitize(String(req.body.confirmPassword));
    const user = await findUserPerId(req.user._id);

    // Check if current password is correct
    if (!bcrypt.compareSync(currentPassword, user.local.password)) {
      const log = new authLog({
        attemptedEmail: sanitize(String(user.local.email)),
        attemptedAction: "password-change",
        userAgent: sanitize(String(req.headers["user-agent"])),
        clientIP: sanitize(String(req.ip)),
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
      attemptedEmail: sanitize(String(user.local.email)),
      attemptedAction: "password-change",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "success",
    });
    await log.save();

    res.redirect("/me/profile"); // Redirect to profile or any other page
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};
