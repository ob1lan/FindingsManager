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
  res.redirect("/findings"); // or wherever you want non-admins to go
};

exports.ensure2FAVerified = (req, res, next) => {
  console.log(`Accessing route: ${req.path}`);

  if (req.path === "/signup") {
    console.log("Accessing signup route, allowing...");
    return next();
  }

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