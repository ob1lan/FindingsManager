// Modify this function in projects.controller.js

const { getProjects } = require("../queries/projects.queries");
const findingsQueries = require("../queries/findings.queries");

exports.viewProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();
    const findings = await findingsQueries.getFindings(); // Ensure this function exists and works as expected
    res.render("projects/projects", {
      projects,
      findings,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
