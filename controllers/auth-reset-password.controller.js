const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const smtpSettingsQuery = require("../queries/settings.queries");
const sendEmail = require("../utils/emailSender");
const {
  findUserPerEmail,
  findUserByResetToken,
} = require("../queries/users.queries");
const envConfig = require(`../environment/${process.env.NODE_ENV}`);
const authLog = require("../database/models/authLog.model");
const sanitize = require("mongo-sanitize");

exports.forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password-form");
};

exports.sendResetLink = async (req, res) => {
  const email = sanitize(String(req.body.email));
  const user = await findUserPerEmail(email);
  const token = crypto.randomBytes(32).toString("hex");
  const smtpSettings = await smtpSettingsQuery.getSMTPSettings();

  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const https = req.connection.encrypted;
  let resetURL;
  if (!https) {
    resetURL = `http://${envConfig.server_hostname}:${envConfig.http_port}/auth/reset-password/${token}`;
  } else {
    resetURL = `https://${envConfig.server_hostname}:${envConfig.https_port}/auth/reset-password/${token}`;
  }

  const mailOptions = {
    to: "antoine@a-delrue.be",
    subject: "Password Reset",
    text: `Click this link to reset your password: ${resetURL}`,
  };

  const resetSent = await sendEmail(mailOptions);

  if (resetSent) {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.body.email)),
      attemptedAction: "password-reset",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "requested",
    });
    await log.save();
    req.flash("success_msg", "Check your email for the reset link!");
  } else {
    req.flash("error_msg", "Failed to send email.");
  }
  res.redirect("/auth/signin");
};

exports.resetPasswordForm = (req, res) => {
  res.render("auth/reset-password-form", {
    token: req.params.token,
    csrfToken: req.csrfToken(),
  });
};

exports.resetPassword = async (req, res) => {
  const user = await findUserByResetToken(req.params.token);
  const body = req.body;
  if (body.newPassword !== body.confirmPassword) {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.body.email)),
      attemptedAction: "password-change",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "failed",
    });
    await log.save();
    req.flash("error_msg", "Passwords do not match!");
  } else {
    password = body.newPassword;
  }

  if (!user || !(user.passwordResetExpires > Date.now())) {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.body.email)),
      attemptedAction: "password-change",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "failed",
    });
    await log.save();
    return res.redirect("/auth/forgot-password");
  }

  user.local.password = bcrypt.hashSync(body.newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  const updatedUser = await user.save();
  if (updatedUser) {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.body.email)),
      attemptedAction: "password-change",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "success",
    });
    await log.save();
    req.flash("success_msg", "Password reset!");
  } else {
    const log = new authLog({
      attemptedEmail: sanitize(String(req.body.email)),
      attemptedAction: "password-change",
      userAgent: sanitize(String(req.headers["user-agent"])),
      clientIP: sanitize(String(req.ip)),
      status: "failed",
    });
    await log.save();
    req.flash("error_msg", "Failed to reset password.");
  }

  res.redirect("/auth/signin");
};
