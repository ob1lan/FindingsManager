const { Parser } = require("json2csv");
// const Papa = require("papaparse");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const {
  createFinding,
  getFindings,
  findFindingPerId,
  updateFinding,
  deleteFinding,
  getFindingsByProjectReference,
} = require("../queries/findings.queries");

const { getProjects } = require("../queries/projects.queries");

exports.findings = async (req, res, next) => {
  try {
    const findings = await getFindings();
    const projects = await getProjects();
    res.render("findings/findings", {
      findings,
      projects,
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

exports.exportToCSV = async (req, res, next) => {
  try {
    const { projectReference } = req.query;

    let findings;

    if (projectReference) {
      findings = await getFindingsByProjectReference(projectReference);
    } else {
      findings = await getFindings();
    }

    const fields = [
      "reference",
      "project",
      "title",
      "type",
      "severity",
      "status",
      "assignee",
      "cve",
      "cvss",
      "reportedBy",
      "description",
      "origin",
      "createdBy",
      "createdAt",
      "updatedAt",
    ];
    const opts = {
      fields,
      quote: "",
      delimiter: ",",
      header: true,
      quoteEmpty: true,
    };
    const parser = new Parser(opts);
    const csv = parser.parse(findings);

    const currentTimestamp = new Date()
      .toISOString()
      .replace(/[:T]/g, "-")
      .slice(0, 19);
    const filename = `findings-${currentTimestamp}.csv`;

    res.header("Content-Type", "text/csv");
    res.attachment(filename);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};

exports.importFromCSV = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const csvFile = req.files.csvFile;
    const findings = [];

    const filePath = path.join(__dirname, "..", "uploads", csvFile.name);

    csvFile.mv(filePath, function (err) {
      if (err) return res.status(500).send(err);

      fs.createReadStream(filePath)
        .pipe(
          csv({
            mapHeaders: ({ header, index }) => header.trim(),
            mapValues: ({ header, index, value }) => value.trim(),
            trim: true,
            skipLines: 1,
          })
        )
        .on("data", (row) => {
          findings.push({
            ...row,
            createdBy: req.user.username, // Set createdBy to the current user
          });
        })
        .on("end", async () => {
          try {
            for (const finding of findings) {
              await createFinding(finding);
            }
            res.redirect("/findings");
          } catch (e) {
            next(e);
          }
        });
    });
  } catch (error) {
    next(error);
  }
};
