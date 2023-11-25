const { createUser, findUserPerId } = require("../queries/users.queries");
const VerificationToken = require("../database/models/verificationToken.model");
const crypto = require("crypto");
const smtpSettingsQuery = require("../queries/settings.queries");
const sendEmail = require("../utils/emailSender");
const fs = require("fs");
const envConfig = require(`../environment/${process.env.NODE_ENV}`);

exports.signup = async (req, res, next) => {
  const body = req.body;
  if (body.username.length > 8) {
    req.flash("error_msg", "Username must have maximum 8 characters.");
    res.redirect("/auth/signin");
  }
  try {
    const user = await createUser(body);
    const token = crypto.randomBytes(32).toString("hex");
    const verificationToken = new VerificationToken({
      userId: user._id,
      token: token,
    });
    await verificationToken.save();

    const https = req.connection.encrypted;
    let link;
    if (!https) {
      link = `http://${envConfig.server_hostname}:${envConfig.portHttp}/auth/verify-email?token=${token}`;
    } else {
      link = `https://${envConfig.server_hostname}:${envConfig.portHttps}/auth/verify-email?token=${token}`;
    }

    const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
    const mailOptions = {
      from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
      to: user.local.email,
      subject: "Email Verification",
      text: `Hello ${user.username},\n\nPlease verify your email by clicking on the following link: ${link}\n\nIf you did not request this, please ignore this email.\n`,
    };

    const emailSent = await sendEmail(smtpSettings, mailOptions);

    if (emailSent) {
      req.flash(
        "success_msg",
        "Registration email sent successfully, please check your inbox!"
      );
    } else {
      req.flash("error_msg", "Failed to send registration email.");
    }

    res.redirect("/auth/signin");
  } catch (e) {
    req.flash("error_msg", "Failed to register the user.");
    res.redirect("/auth/signin");
  }
};

exports.verifyEmail = async (req, res) => {
  console.log("Verifying email...");
  const token = req.query.token;
  const verificationToken = await VerificationToken.findOne({ token: token });
  if (!verificationToken) {
    return res.status(400).send({ msg: "Invalid or expired token" });
  }
  const user = await findUserPerId(verificationToken.userId);
  if (!user) return res.status(400).send({ msg: "User not found" });
  user.isVerified = true;
  await user.save();
  await verificationToken.deleteOne();
  req.flash("success_msg", "Email verified, you can now login!");
  res.redirect("/auth/signin");
};