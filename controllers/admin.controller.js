const {
  getAllUsers,
  createUser,
  findUserPerId,
  searchUsersPerUsername,
  updateUserDetails,
} = require("../queries/users.queries");

exports.viewUsers = async (req, res, next) => {
  try {
    // Fetch all users
    const users = await getAllUsers();
    res.render("admin/users-list", {
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
  // Logic to delete a user
};