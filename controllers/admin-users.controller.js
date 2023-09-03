const {
  getAllUsers,
  createUser,
  findUserPerId,
  searchUsersPerUsername,
  updateUserDetails,
  deleteUser,
} = require("../queries/users.queries");

exports.viewUsers = async (req, res, next) => {
  try {
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
    const updatedData = req.body;
    await updateUserDetails(userId, updatedData);
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