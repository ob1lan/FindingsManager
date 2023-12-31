const { getProjects } = require("../queries/projects.queries");
const findingsQueries = require("../queries/findings.queries");

exports.viewProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();
    const findings = await findingsQueries.getFindings();
    res.render("projects/projects", {
      projects,
      findings,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};
