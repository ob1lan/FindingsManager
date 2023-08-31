const passport = require("passport");
const speakeasy = require("speakeasy");
const authLog = require("../database/models/authLog.model");

exports.signinForm = (req, res, next) => {
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
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
    res.redirect("/findings");
  } else {
    res.render("auth/otp-form", {
      errors: ["Invalid OTP. Try again."],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.viewAllLoginLogs = async (req, res, next) => {
  const logs = await LoginLog.find().populate("userId").exec();
  res.render("auth/admin-logs", { logs });
};

exports.viewUserLoginLogs = async (req, res, next) => {
  const logs = await LoginLog.find({ userId: req.user._id }).limit(5).exec();
  res.render("auth/user-logs", { logs });
};
