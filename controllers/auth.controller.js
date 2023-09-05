const passport = require("passport");
const speakeasy = require("speakeasy");
const authLog = require("../database/models/authLog.model");
const fs = require("fs");
const VerificationToken = require("../database/models/verificationToken.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const smtpSettingsQuery = require("../queries/settings.queries");
const { sendEmail } = require("../utils/emailSender");
const {
  createUser,
  findUserPerId,
  findUserPerEmail,
  findUserByResetToken,
} = require("../queries/users.queries");
let config = JSON.parse(fs.readFileSync("config/config.json", "utf8"));

exports.signupForm = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/findings");
  }
  res.render("auth/registration-form", {
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
    const token = crypto.randomBytes(32).toString("hex");
    const verificationToken = new VerificationToken({
      userId: user._id,
      token: token,
    });
    await verificationToken.save();

    const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
    const sendEmail = require("../utils/emailSender");

    const https = req.connection.encrypted;
    let link;
    if (!https) {
      link = `http://${config.server_hostname}:${config.http_port}/auth/verify-email?token=${token}`;
    } else {
      link = `https://${config.server_hostname}:${config.https_port}/auth/verify-email?token=${token}`;
    }

    const mailOptions = {
      from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
      to: user.local.email,
      subject: "Email Verification",
      text: `Hello ${user.username},\n\nPlease verify your email by clicking on the following link: ${link}\n\nIf you did not request this, please ignore this email.\n`,
    };

    const emailSent = await sendEmail(smtpSettings, mailOptions);

    if (emailSent) {
      req.flash("success_msg", "Registration email sent successfully, please check your inbox!");
    } else {
      req.flash(
        "error_msg",
        "Failed to send registration email."
      );
    }

    res.redirect("/auth/signin");
  } catch (e) {
    res.render("auth/registration-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.signinForm = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/findings");
  }
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
    verified: req.query.verified,
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    } else if (!user) {
      try {
        const log = new authLog({
          attemptedEmail: req.body.email,
          attemptedAction: "login",
          userAgent: req.headers["user-agent"],
          clientIP: req.ip,
          status: "failed",
        });
        await log.save();

        return res.render("auth/auth-form", {
          errors: [info.message],
          isAuthenticated: req.isAuthenticated(),
          is2FAVerified: req.session.is2FAVerified,
          currentUser: req.user,
        });
      } catch (error) {
        return next(error);
      }
    } else {
      req.login(user, async (err) => {
        if (err) {
          return next(err);
        } else {
          try {
            const log = new authLog({
              attemptedEmail: req.body.email,
              attemptedAction: "login",
              userAgent: req.headers["user-agent"],
              clientIP: req.ip,
              status: "success",
            });
            await log.save();
          } catch (error) {
            return next(error);
          }

          if (user.twoFAEnabled) {
            return res.redirect("/auth/verify-otp");
          } else {
            return res.redirect("/findings");
          }
        }
      });
    }
  })(req, res, next);
};

exports.signout = (req, res, next) => {
  const email = req.user.local.email;
  req.logout(async (err) => {
    if (err) {
      return next(err);
    }
    req.session.is2FAVerified = false;
    try {
      const log = new authLog({
        attemptedEmail: email,
        attemptedAction: "logout",
        userAgent: req.headers["user-agent"],
        clientIP: req.ip,
        status: "success",
      });
      await log.save();
      res.redirect("/auth/signin");
    } catch (error) {
      return next(error);
    }
  });
};

exports.otpForm = (req, res, next) => {
  res.render("auth/otp-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    is2FAVerified: req.session.is2FAVerified,
    currentUser: req.user,
  });
};

exports.verifyOtp = (req, res, next) => {
  const { otp } = req.body;
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFASecret,
    encoding: "base32",
    token: otp,
  });

  if (verified) {
    req.session.is2FAVerified = true;
    res.redirect("/findings");
  } else {
    res.render("auth/otp-form", {
      errors: ["Invalid OTP. Try again."],
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
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

exports.forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password-form");
};

exports.sendResetLink = async (req, res) => {
  const email = req.body.email;
  const user = await findUserPerEmail(email);
  const token = crypto.randomBytes(32).toString("hex");
  const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
  const sendEmail = require("../utils/emailSender");

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
