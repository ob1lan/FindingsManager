// Renders the dashboard page
exports.dashboard = (req, res) => {
  try {
    res.render("dashboard", {
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
