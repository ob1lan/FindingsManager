const passport = require("passport");
const speakeasy = require("speakeasy");
const authLog = require("../database/models/authLog.model");
const fs = require("fs");
const VerificationToken = require("../database/models/verificationToken.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Settings = require("../database/models/settings.model");
const { createUser, findUserPerId } = require("../queries/users.queries");
let config = JSON.parse(fs.readFileSync('config/config.json', 'utf8'));


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

    const smtpSettings = await Settings.findOne();
    console.log(smtpSettings);
    const transporter = nodemailer.createTransport({
      host: smtpSettings.smtpHost,
      port: smtpSettings.smtpPort,
      // auth: {
      //   user: smtpSettings.smtpUsername,
      //   pass: smtpSettings.smtpPassword,
      // },
    });

    const https = req.connection.encrypted;
    let link;
    if (!https) {
      link = `http://${config.server_hostname}:${config.http_port}/auth/verify-email?token=${token}`;
    } else {
      link = `https://${config.server_hostname}:${config.https_port}/auth/verify-email?token=${token}`;
    }

    const mailOptions = {
      from: smtpSettings.smtpUsername || "noreply@findingsmanager.com", // sender address
      to: user.local.email, // user's email address
      subject: "Email Verification",
      text: `Hello ${user.username},\n\nPlease verify your email by clicking on the following link: ${link}\n\nIf you did not request this, please ignore this email.\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        // Handle the error appropriately in your application
      } else {
        console.log("Email sent:", info.response);
        // Handle successful email sending, maybe redirect the user to a page informing them to check their email
      }
    });

    res.redirect("/");
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
      // Log the failed login attempt
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
          // Log the successful login attempt
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
            // Redirect to OTP verification page
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

// exports.viewAllLoginLogs = async (req, res, next) => {
//   const logs = await LoginLog.find().populate("userId").exec();
//   res.render("auth/admin-logs", { logs });
// };

// exports.viewUserLoginLogs = async (req, res, next) => {
//   const logs = await LoginLog.find({ userId: req.user._id }).limit(5).exec();
//   res.render("auth/user-logs", { logs });
// };

exports.verifyEmail = async (req, res) => {
  console.log("Verifying email...");
  const token = req.query.token;
  const verificationToken = await VerificationToken.findOne({ token: token });
  if (!verificationToken) {
    // Token is not valid or has expired
    return res.status(400).send({ msg: "Invalid or expired token" });
  }
  const user = await findUserPerId(verificationToken.userId);
  if (!user) return res.status(400).send({ msg: "User not found" });
  user.isVerified = true;
  await user.save();
  await verificationToken.deleteOne();
  res.redirect("/auth/signin?verified=true");
};
