const {
  createFinding,
  getFindings,
  findFindingPerId,
  updateFinding,
  deleteFinding,
} = require("../queries/findings.queries");

exports.findings = async (req, res, next) => {
  try {
    const findings = await getFindings();
    res.render("findings/findings", {
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
    res.status(400).render("findings/findings", {
      errors,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.findingDetails = async (req, res, next) => {
  try {
    const finding = await findFindingPerId(req.params.id);
    res.json(finding); // This sends the finding details as JSON. You can modify this to render a view if needed.
  } catch (error) {
    next(error);
  }
};

exports.findingEdit = async (req, res, next) => {
  if (req.method === "GET") {
    try {
      res.redirect("/findings");
    } catch (error) {
      next(error);
    }
  } else if (req.method === "POST") {
    try {
      // Here, you'll update the finding with the new data from req.body
      // You might use a function like updateFinding from your queries
      await updateFinding(req.params.id, req.body);
      res.redirect("/findings");
    } catch (error) {
      next(error);
    }
  }
};

exports.findingDelete = async (req, res, next) => {
  try {
    // Here, you'll delete the finding using its ID
    // You might use a function like deleteFinding from your queries
    await deleteFinding(req.params.id);
    res.redirect("/findings");
  } catch (error) {
    next(error);
  }
};
