// Renders the dashboard page
exports.dashboard = (req, res) => {
  res.render("dashboard", {
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
    user: req.user,
  });
};
