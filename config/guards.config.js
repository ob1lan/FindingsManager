exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/signin");
  }
};

exports.ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.redirect("/findings");
};

exports.ensureEmailVerified = (req, res, next) => {
  console.log("isAuthenticated: ", req.isAuthenticated());
  console.log("User: ", req.user);
  console.log("Email Verified:", req.user?.isVerified);
  if (req.isAuthenticated() && req.user.isVerified) {
      return next();
    } else {
      return res.status(403).json({ message: "An error occured, please retry in a few moments"});
    }
};

exports.ensure2FAVerified = (req, res, next) => {
  console.log(`Accessing route: ${req.path}`);
  if (req.isAuthenticated()) {
    if (req.user.twoFAEnabled && !req.session.is2FAVerified) {
      console.log("Redirecting to OTP verification");
      return res.redirect("/auth/verify-otp");
    }
    console.log("User authenticated, allowing...");
    return next();
  } else {
    console.log("User not authenticated, redirecting to signin");
    return res.redirect("/auth/signin");
  }
};
