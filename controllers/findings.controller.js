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

const { findUserPerUsername } = require("../queries/users.queries");
const { getProjects } = require("../queries/projects.queries");
const { getSLASettings } = require("../queries/settings.queries");
const { getAllUsers } = require("../queries/users.queries");
const { getProducts } = require("../queries/products.queries");
const sendEmail = require("../utils/emailSender");

exports.findings = async (req, res, next) => {
  try {
    const findings = await getFindings();
    const projects = await getProjects();
    const users = await getAllUsers();
    const products = await getProducts();
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
    const assignee = await findUserPerUsername(req.body.assignee);
    let attachmentPath = "";
    if (req.file) {
      absolutePath = req.file.path;
      attachmentPath = absolutePath.replace("public", "");
    }
    await createFinding({
      ...req.body,
      createdBy: req.user.username,
      attachment: attachmentPath,
    });
    try {
      const text = `Hello ${assignee.username},\r\rYou have been assigned a new finding on ${req.body.product} with reference ${req.body.reference}.\r\rTitle: ${req.body.title}\r\rRaised by: ${req.body.project}\r\rPlease login to the Findings Manager to view more details.\n`;
      await sendEmail(assignee.local.email, "New finding assigned to you", text);
    } catch (error) {
      console.error(error);
    }
    res.redirect("/findings");
  } catch (e) {
    console.error(e);
    res.status(400).render("findings/findings", {
      e,
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
      const finding = await findFindingPerId(req.params.id);
      await updateFinding(req.params.id, {
        status: req.body.status,
      });
      if (["Remediated", "Accepted", "Declined"].includes(req.body.status)) {
        req.body.fixedDate = new Date();
        if (finding.createdAt && req.body.fixedDate) {
          const timeToFix =
            (req.body.fixedDate - finding.createdAt) / (1000 * 60 * 60 * 24);
          if (!isNaN(timeToFix)) {
            req.body.timeToFix = timeToFix.toFixed(0);
          } else {
            console.error("Invalid date calculation for timeToFix");
          }
        }
      } else if (req.body.status === "In Remediation") {
        req.body.fixedDate = null;
        req.body.timeToFix = null;
      }
      await updateFinding(req.params.id, req.body);
      const assignee = await findUserPerUsername(req.body.assignee);
      const text = `Hello ${assignee.username},\r\rYou have been assigned an updated finding on ${req.body.product} with reference ${req.body.reference}.\r\rTitle: ${req.body.title}\r\rRaised by: ${req.body.project}\r\rPlease login to the Findings Manager to view more details.\n`;
      await sendEmail(
        assignee.local.email,
        "Updated finding assigned to you",
        text
      );
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
      "product",
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
        for (let key in row) {
          row[key] = row[key].trim().replace(/^"(.*)"$/, "$1");
        }
        findings.push(row);
      })
      .on("end", async () => {
        for (const finding of findings) {
          await createFinding(finding);
        }
        res.redirect("/findings");
      });
  } catch (error) {
    next(error);
  }
};

exports.findingShare = async (req, res, next) => {
  try {
    const finding = await findFindingPerId(req.params.id);
    const recipients = req.body.recipients
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    await Promise.all(
      recipients.map((recipient) =>
        sendEmail(
          recipient,
          `${req.user.username} shared a finding with you`,
          `Hello,\n\nA finding has been shared with you:\n\n${finding.reference} - (${finding.severity}) ${finding.title} on ${finding.product}\n\nStatus: ${finding.status}\nAssignee: ${finding.assignee}\nOrigin: ${finding.origin}\nReported By: ${finding.reportedBy}\nDue Date: ${finding.dueDate}\n\nPlease login to the Findings Manager to view more details.\n`
        )
      )
    );
    res.redirect("/findings");
  } catch (error) {
    next(error);
  }
};
