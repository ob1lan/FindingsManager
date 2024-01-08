const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const csrf = require("csurf");
const csrfProtection = csrf();

const projectsCtrl = require("../controllers/projects.controller");

router.get("/", ensureAuthenticated, csrfProtection, projectsCtrl.viewProjects);

module.exports = router;
