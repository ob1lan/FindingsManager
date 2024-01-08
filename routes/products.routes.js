const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");
const csrf = require("csurf");
const csrfProtection = csrf();

const productsCtrl = require("../controllers/products.controller");

router.get("/", ensureAuthenticated, csrfProtection, productsCtrl.viewProducts);

module.exports = router;
