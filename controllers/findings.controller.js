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
  getOverdueFindings,
} = require("../queries/findings.queries");

const { findUserPerUsername } = require("../queries/users.queries");

const { getProjects } = require("../queries/projects.queries");
const { getSLASettings } = require("../queries/settings.queries");
const { getAllUsers } = require("../queries/users.queries");
const { getProducts } = require("../queries/products.queries");
const smtpSettingsQuery = require("../queries/settings.queries");
const sendEmail = require("../utils/emailSender");

exports.findings = async (req, res, next) => {
  try {
    const findings = await getFindings();
    const projects = await getProjects();
    const users = await getAllUsers();
    const products = await getProducts();
    console.log("Products:", products);

    res.render("findings/findings", {
      findings,
      products,
      projects,
      users,
      slaSettings: await getSLASettings(),
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user: req.user,
      is2FAVerified: req.session.is2FAVerified,
    });
  } catch (error) {
    next(error);
  }
};

exports.findingCreate = async (req, res, next) => {
  try {
    const body = req.body;
    const assignee = await findUserPerUsername(body.assignee);
    let attachmentPath = "";
    if (req.file) {
      absolutePath = req.file.path;
      attachmentPath = absolutePath.replace("public", "");
    }
    await createFinding({
      ...body,
      createdBy: req.user.username,
      attachment: attachmentPath,
      product: body.productId,
    });

    const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
    const mailOptions = {
      from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
      to: assignee.local.email,
      subject: "New finding assigned to you",
      text: `Hello ${assignee.username},\n\nYou have been assigned a new finding with reference ${body.reference}.\n\nTitle: ${body.title}\n\nPlease login to the Findings Manager to view more details.\n`,
    };

    const emailSent = await sendEmail(smtpSettings, mailOptions);

    res.redirect("/findings");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).render("findings/findings", {
      errors,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
    });
  }
};

exports.findingDetails = async (req, res, next) => {
  try {
    const finding = await findFindingPerId(req.params.id);
    res.json(finding);
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
      const updateData = req.body;
      const finding = await findFindingPerId(req.params.id);

      // Check if the status is being updated to Remediated, Accepted, or Declined
      if (["Remediated", "Accepted", "Declined"].includes(updateData.status)) {
        // Set the fixedDate to the current date
        updateData.fixedDate = new Date();
        console.log("Fixed Date:", updateData.fixedDate);

        if (finding.createdAt && updateData.fixedDate) {
          const timeToFix =
            (updateData.fixedDate - finding.createdAt) / (1000 * 60 * 60 * 24);
          if (!isNaN(timeToFix)) {
            updateData.timeToFix = timeToFix.toFixed(0);
          } else {
            console.error("Invalid date calculation for timeToFix");
          }
        }
      } else if (updateData.status === "In Remediation") {
        updateData.fixedDate = null;
        updateData.timeToFix = null;
      }
      await updateFinding(req.params.id, req.body);
      const assignee = await findUserPerUsername(updateData.assignee);
      const smtpSettings = await smtpSettingsQuery.getSMTPSettings();
      const mailOptions = {
        from: smtpSettings.smtpUsername || "noreply@findingsmanager.com",
        to: assignee.local.email,
        subject: "Updated finding assigned to you",
        text: `Hello ${assignee.username},\n\nYou have been assigned an updated finding with reference ${updateData.reference}.\n\nTitle: ${updateData.title}\n\nPlease login to the Findings Manager to view more details.\n`,
      };

      const emailSent = await sendEmail(smtpSettings, mailOptions);
      res.redirect("/findings");
    } catch (error) {
      next(error);
    }
  }
};

exports.findingDelete = async (req, res, next) => {
  try {
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
      "dueDate",
      "fixedDate",
      "timeToFix",
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
