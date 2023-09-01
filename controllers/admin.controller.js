const {
  getAllUsers,
  createUser,
  findUserPerId,
  searchUsersPerUsername,
  updateUserDetails,
  deleteUser,
} = require("../queries/users.queries");

const {
  getProjects,
  createProject,
  findProjectPerId,
  deleteProject,
  updateProject,
} = require("../queries/projects.queries");

exports.viewUsers = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await getAllUsers();
    res.render("admin/users-list", {
      users,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  // Logic to create a new user
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body; // This contains the form data from the modal

    await updateUserDetails(userId, updatedData);

    // If you're using AJAX to submit the form, you might send a JSON response instead of a redirect.
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    // Here, you'll delete the finding using its ID
    await deleteUser(req.params.id);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

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
    const projectId = req.params.id;
    const updatedData = req.body; // This contains the form data from the modal

    await updateProject(projectId, updatedData);

    // If you're using AJAX to submit the form, you might send a JSON response instead of a redirect.
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    // Here, you'll delete the finding using its ID
    await deleteProject(req.params.id);
    res.redirect("/admin/projects");
  } catch (error) {
    next(error);
  }
};