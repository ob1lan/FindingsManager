const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const {
  viewUsers,
  createUser,
  editUser,
  updateUserRole,
} = require("../controllers/admin.controller");

router.get("/users", ensureAuthenticated, ensureAdmin, viewUsers);
router.post("/users", ensureAuthenticated, ensureAdmin, createUser);
router.get("/users/:id/edit", ensureAuthenticated, ensureAdmin, editUser);
router.post(
  "/users/:id/role",
  ensureAuthenticated,
  ensureAdmin,
  updateUserRole
);

module.exports = router;
