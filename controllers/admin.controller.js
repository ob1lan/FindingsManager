const {
  getAllUsers,
  createUser,
  findUserPerId,
  searchUsersPerUsername,
} = require("../queries/users.queries");

exports.viewUsers = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await getAllUsers();
    res.render("admin/users", {
      users,
      isAuthenticated: req.isAuthenticated(),
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

exports.editUser = async (req, res, next) => {
  // Logic to edit user details
};

exports.updateUserRole = async (req, res, next) => {
  // Logic to update user role
};
