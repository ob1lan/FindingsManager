exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/signin");
  }
};

exports.ensureAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  } else {
    res.redirect("/findings");
  }
};

exports.ensure2FAVerified = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.twoFAEnabled && !req.session.is2FAVerified) {
      return res.redirect("/auth/verify-otp");
    }
    return next();
  } else {
    return res.redirect("/auth/signin");
  }
};
