const {
  createFinding,
  getFindings,
  findFindingPerId,
} = require("../queries/findings.queries");

exports.dashboard = async (req, res, next) => {
  try {
    const findings = await getFindings();
    res.render("dashboard", {
      findings,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

exports.findingCreate = async (req, res, next) => {
  try {
    const body = req.body;
    await createFinding({ ...body });
    res.redirect("/dashboard");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res
      .status(400)
      .render("dashboard", {
        errors,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
  }
};