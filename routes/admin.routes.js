const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const csrf = require("csurf");
const csrfProtection = csrf();

const {
  viewUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin-users.controller");

const {
  viewProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/admin-projects.controller");

const {
  viewProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/admin-products.controller");

const {
  viewSettings,
  saveSettings,
  sendTestEmail,
} = require("../controllers/admin-setting.controller");

router.get(
  "/",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  (req, res, next) => {
    res.redirect("/admin/users");
  }
);
router.get(
  "/users",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  viewUsers
);
router.post(
  "/users/create",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  createUser
);
router.get(
  "/users/:id/delete",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  deleteUser
);
router.post(
  "/users/:id/edit",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  updateUser
);

router.get(
  "/projects",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  viewProjects
);
router.post(
  "/projects/create",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  createProject
);
router.post(
  "/projects/:id/edit",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  updateProject
);
router.get(
  "/projects/:id/delete",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  deleteProject
);

router.get(
  "/products",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  viewProducts
);
router.post(
  "/products/create",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  createProduct
);
router.post(
  "/products/:id/edit",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  updateProduct
);
router.get(
  "/products/:id/delete",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  deleteProduct
);

router.get(
  "/settings",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  viewSettings
);
router.post(
  "/settings",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  saveSettings
);

router.post(
  "/test-email",
  ensureAuthenticated,
  ensureAdmin,
  csrfProtection,
  sendTestEmail
);

module.exports = router;
