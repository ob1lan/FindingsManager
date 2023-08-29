const passport = require("passport");
const speakeasy = require("speakeasy");

exports.signinForm = (req, res, next) => {
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    } else if (!user) {
      res.render("auth/auth-form", {
        errors: [info.message],
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    } else {
      req.login(user, (err) => {
        if (err) {
          next(err);
        } else {
          if (user.twoFAEnabled) {
            // Redirect to OTP verification page
            return res.redirect("/auth/verify-otp");
          } else {
            res.redirect("/findings");
          }
        }
      });
    }
  })(req, res, next);
};

exports.signout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/signin/form");
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
