const {
  createUser,
  findUserPerUsername,
  searchUsersPerUsername,
  findUserPerId,
} = require("../queries/users.queries");
const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/avatars"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

exports.userList = async (req, res, next) => {
  try {
    const search = req.query.search;
    const users = await searchUsersPerUsername(search);
    res.render("includes/search-menu", { users });
  } catch (e) {
    next(e);
  }
};

exports.profile = async (req, res, next) => {
  try {
    const username = currentUser;
    res.render("users/profile", {
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  } catch (e) {
    next(e);
  }
};

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await findUserPerUsername(username);
  } catch (e) {
    next(e);
  }
};

exports.signupForm = (req, res, next) => {
  res.render("users/user-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signup = async (req, res, next) => {
  const body = req.body;
  try {
    const user = await createUser(body);
    res.redirect("/");
  } catch (e) {
    res.render("users/user-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.uploadImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  },
];
