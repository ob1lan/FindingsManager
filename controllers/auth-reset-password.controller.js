const crypto = require("crypto");
const bcrypt = require("bcrypt");
const fs = require("fs");
const smtpSettingsQuery = require("../queries/settings.queries");
const sendEmail = require("../utils/emailSender");
const {
  findUserPerEmail,
  findUserByResetToken,
} = require("../queries/users.queries");
let config = JSON.parse(fs.readFileSync("config/config.json", "utf8"));

exports.forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password-form");
};

exports.sendResetLink = async (req, res) => {
  const email = req.body.email;
  const user = await findUserPerEmail(email);
  const token = crypto.randomBytes(32).toString("hex");
  const smtpSettings = await smtpSettingsQuery.getSMTPSettings();

  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const https = req.connection.encrypted;
  let resetURL;
  if (!https) {
    resetURL = `http://${config.server_hostname}:${config.http_port}/auth/reset-password/${token}`;
  } else {
    resetURL = `https://${config.server_hostname}:${config.https_port}/auth/reset-password/${token}`;
  }

  console.log("smtpSettings: ", smtpSettings);
  const mailOptions = {
    from: smtpSettings.smtpUsername || "default@example.com",
    to: email,
    subject: "Password Reset",
    text: `Click this link to reset your password: ${resetURL}`,
  };

  const resetSent = await sendEmail(smtpSettings, mailOptions);
  if (resetSent) {
    req.flash("success_msg", "Check your email for the reset link!");
  } else {
    req.flash("error_msg", "Failed to send email.");
  }
  res.redirect("/auth/signin");
};

exports.resetPasswordForm = (req, res) => {
  res.render("auth/reset-password-form", { token: req.params.token });
};

exports.resetPassword = async (req, res) => {
  const user = await findUserByResetToken(req.params.token);
  const body = req.body;
  if (body.newPassword !== body.confirmPassword) {
    return res.status(400).send("Passwords do not match");
  } else {
    password = body.newPassword;
  }

  if (!user || !(user.passwordResetExpires > Date.now())) {
    return res.redirect("/auth/forgot-password");
  }

  user.local.password = bcrypt.hashSync(body.newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  const updatedUser = await user.save();
  if (updatedUser) {
    req.flash("success_msg", "Password reset!");
  } else {
    req.flash("error_msg", "Failed to reset password.");
  }

  res.redirect("/auth/signin");
};
