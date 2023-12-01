const router = require("express").Router();
const { ensureAuthenticated } = require("../config/guards.config");

const productsCtrl = require("../controllers/products.controller");

router.get("/", ensureAuthenticated, productsCtrl.viewProducts);

module.exports = router;
