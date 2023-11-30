const { getProjects } = require("../queries/projects.queries");

exports.viewProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();
    res.render("projects/projects", {
      projects,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
