const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");

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
  viewSettings,
  saveSettings,
  sendTestEmail,
} = require("../controllers/admin-setting.controller");


router.get("/", ensureAdmin, (req, res, next) => {
  res.redirect("/admin/users");
});
router.get("/users", ensureAuthenticated, ensureAdmin, viewUsers);
router.post("/users", ensureAuthenticated, ensureAdmin, createUser);
router.get("/users/:id/delete", ensureAuthenticated, ensureAdmin, deleteUser);
router.post("/users/:id/edit", ensureAuthenticated, ensureAdmin, updateUser);

router.get("/projects", ensureAuthenticated, ensureAdmin, viewProjects);
router.post("/projects/create", ensureAdmin, createProject);
router.post("/projects/:id/edit", ensureAdmin, updateProject);
router.get("/projects/:id/delete", ensureAdmin, deleteProject);

router.get("/settings", ensureAuthenticated, ensureAdmin, viewSettings);
router.post("/settings", ensureAuthenticated, ensureAdmin, saveSettings);

router.post("/test-email", ensureAuthenticated, ensureAdmin, sendTestEmail);

module.exports = router;
