const {
  getAllUsers,
  createUser,
  updateUserDetails,
  deleteUser,
} = require("../queries/users.queries");
const sanitize = require("mongo-sanitize");

exports.viewUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.render("admin/users-list", {
      users,
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

exports.createUser = async (req, res, next) => {
  try {
    const userData = req.body;
    if (userData.username.length > 8) {
      res.redirect("/admin/users");
    }
    await createUser(userData);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = sanitize(String(req.params.id));
    const updatedData = req.body;
    await updateUserDetails(userId, updatedData);
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await deleteUser(sanitize(String(req.params.id)));
    res.redirect("/admin/users");
  } catch (error) {
    next(error);
  }
};