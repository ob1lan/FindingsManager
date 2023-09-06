const passport = require("passport");
const speakeasy = require("speakeasy");
const authLog = require("../database/models/authLog.model");

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
