const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");

const projectsCtrl = require("../controllers/projects.controller");

router.get("/", ensureAuthenticated, projectsCtrl.viewProjects);

module.exports = router;
