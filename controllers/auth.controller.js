const passport = require("passport");
const speakeasy = require("speakeasy");
const authLog = require("../database/models/authLog.model");
const sanitize = require("mongo-sanitize");

const logAuthAttempt = async (email, action, userAgent, clientIP, status) => {
  try {
    const log = new authLog({
      attemptedEmail: sanitize(email),
      attemptedAction: action,
      userAgent: sanitize(userAgent),
      clientIP: sanitize(clientIP),
      status: status,
    });
    await log.save();
  } catch (error) {
    console.error("Error logging auth attempt:", error);
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
    csrfToken: req.csrfToken(),
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err);
    } else if (!user) {
      try {
        await logAuthAttempt(
          req.body.email,
          "login",
          req.headers["user-agent"],
          req.ip,
          "failed"
        );

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
      // Check if the user's email is verified
      if (!user.isVerified) {
        return res.render("auth/auth-form", {
          errors: ["Your email is not verified. Please check your inbox."],
          isAuthenticated: req.isAuthenticated(),
          is2FAVerified: req.session.is2FAVerified,
          currentUser: req.user,
        });
      }
      req.login(user, async (err) => {
        if (err) {
          return next(err);
        } else {
          try {
            await logAuthAttempt(
              req.body.email,
              "login",
              req.headers["user-agent"],
              req.ip,
              "success"
            );
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
  const email = sanitize(String(req.user.local.email));
  req.logout(async (err) => {
    if (err) {
      return next(err);
    }
    req.session.is2FAVerified = false;
    try {
      await logAuthAttempt(
        req.body.email,
        "logout",
        req.headers["user-agent"],
        req.ip,
        "success"
      );
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
    csrfToken: req.csrfToken(),
  });
};

exports.verifyOtp = async (req, res, next) => {
  const otp = sanitize(String(req.body.otp));
  const verified = speakeasy.totp.verify({
    secret: req.user.twoFASecret,
    encoding: "base32",
    token: otp,
  });

  if (verified) {
    try {
      await logAuthAttempt(
        req.user.local.email,
        "2FAlogin",
        req.headers["user-agent"],
        req.ip,
        "success"
      );
      req.session.is2FAVerified = true;
      res.redirect("/findings");
    } catch (error) {
      return next(error);
    }
  } else {
    try {
      await logAuthAttempt(
        req.user.local.email,
        "2FAlogin",
        req.headers["user-agent"],
        req.ip,
        "failed"
      );
    } catch (error) {
      console.error("Error logging auth attempt:", error);
    }
    res.render("auth/otp-form", {
      errors: ["Invalid OTP. Try again."],
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};
