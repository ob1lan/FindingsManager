// Modify this function in projects.controller.js

const { getProducts } = require("../queries/products.queries");
const findingsQueries = require("../queries/findings.queries");

exports.viewProducts = async (req, res, next) => {
  try {
    const products = await getProducts();
    const findings = await findingsQueries.getFindings(); // Ensure this function exists and works as expected
    res.render("products/products", {
      products,
      findings,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};
