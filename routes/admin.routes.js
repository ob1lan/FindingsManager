const router = require("express").Router();
const { ensureAuthenticated, ensureAdmin } = require("../config/guards.config");
const {
  viewUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");

router.get("/users", ensureAuthenticated, ensureAdmin, viewUsers);
router.post("/users", ensureAuthenticated, ensureAdmin, createUser);
router.get("/users/:id/delete", ensureAuthenticated, ensureAdmin, deleteUser);
router.post(
  "/users/:id/edit",
  ensureAuthenticated,
  ensureAdmin,
  updateUser
);

module.exports = router;
