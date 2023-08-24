const {
  createFinding,
  getFindings,
  findFindingPerId,
} = require("../queries/findings.queries");

exports.findings = async (req, res, next) => {
  try {
    const findings = await getFindings();
    res.render("findings", {
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
    await createFinding({ ...body, createdBy: req.user.username });
    res.redirect("/findings");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res
      .status(400)
      .render("findings", {
        errors,
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
  }
};