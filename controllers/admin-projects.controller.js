const {
  getProjects,
  createProject,
  deleteProject,
  updateProject,
} = require("../queries/projects.queries");
const sanitize = require("mongo-sanitize");

exports.viewProjects = async (req, res, next) => {
  try {
    const projects = await getProjects();
    res.render("admin/projects-list", {
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

exports.createProject = async (req, res, next) => {
  try {
    const body = req.body;
    await createProject({ ...body, createdBy: req.user.username });
    res.redirect("/admin/projects");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).render("admin/projects-list", {
      errors,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const projectId = sanitize(String(req.params.id));
    const updatedData = req.body;

    await updateProject(projectId, updatedData);
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await deleteProject(sanitize(String(req.params.id)));
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};
