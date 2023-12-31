const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../queries/products.queries");
const sanitize = require("mongo-sanitize");

exports.viewProducts = async (req, res, next) => {
  try {
    const products = await getProducts();
    res.render("admin/products-list", {
      products,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const body = req.body;
    await createProduct({ ...body });
    res.redirect("/admin/products");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).render("admin/products-list", {
      errors,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = sanitize(String(req.params.id));
    const updatedData = req.body;

    await updateProduct(productId, updatedData);
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await deleteProduct(sanitize(String(req.params.id)));
    res.redirect("/admin/products");
  } catch (error) {
    next(error);
  }
};
