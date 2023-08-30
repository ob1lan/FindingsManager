const { Parser } = require("json2csv");
const csv = require("csv-parser");
const { Readable } = require("stream");

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

exports.importFindings = async (req, res, next) => {
  try {
    const findings = [];
    const fileBuffer = req.file.buffer;

    const stream = new Readable({
      read() {
        this.push(fileBuffer);
        this.push(null);
      },
    });

    stream
      .pipe(csv())
      .on("data", (row) => {
        // Transform each value: Remove outer double quotes if present
        for (let key in row) {
          row[key] = row[key].trim().replace(/^"(.*)"$/, "$1");
        }
        console.log(row);
        // Validate and transform the row as per the Finding model
        findings.push(row);
      })
      .on("end", async () => {
        // Save findings to the database using the createFinding function
        for (const finding of findings) {
          await createFinding(finding);
        }
        res.redirect("/findings");
      });
  } catch (error) {
    next(error);
  }
};
