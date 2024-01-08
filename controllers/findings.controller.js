const { Parser } = require("json2csv");
const csv = require("csv-parser");
const { Readable } = require("stream");
const sanitize = require("mongo-sanitize");

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
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

exports.findingCreate = async (req, res, next) => {
  try {
    const assignee = await findUserPerUsername(
      sanitize(String(req.body.assignee))
    );
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
      await sendEmail(
        assignee.local.email,
        "New finding assigned to you",
        text
      );
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
      csrfToken: req.csrfToken(),
    });
  }
};

exports.findingDetails = async (req, res, next) => {
  try {
    const finding = await findFindingPerId(sanitize(String(req.params.id)));
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
      const originalFinding = await findFindingPerId(
        sanitize(String(req.params.id))
      );
      const updates = req.body;
      const changes = new Map();

      const assignee = await findUserPerUsername(
        sanitize(String(req.body.assignee))
      );

      Object.keys(updates).forEach((key) => {
        if (updates[key] !== originalFinding[key]) {
          changes.set(key, updates[key]);
        }
      });

      if (changes.size > 0) {
        const historyUpdate = {
          changedBy: req.user.username,
          changedAt: new Date(),
          changes: Object.fromEntries(changes),
        };

        await updateFinding(sanitize(String(req.params.id)), {
          ...updates,
          $push: { history: historyUpdate },
        });

        if (
          ["Remediated", "Accepted", "Declined"].includes(
            sanitize(String(req.body.status))
          )
        ) {
          req.body.fixedDate = new Date();
          if (originalFinding.createdAt && req.body.fixedDate) {
            const timeToFix =
              (req.body.fixedDate - originalFinding.createdAt) /
              (1000 * 60 * 60 * 24);
            if (!isNaN(timeToFix)) {
              req.body.timeToFix = timeToFix.toFixed(0);
            } else {
              console.error("Invalid date calculation for timeToFix");
            }
          }
        } else if (sanitize(String(req.body.status)) === "In Remediation") {
          req.body.fixedDate = null;
          req.body.timeToFix = null;
        }

        await updateFinding(sanitize(String(req.params.id)), req.body);
      }

      try {
        const text = `Hello ${assignee.username},\r\rYou have been assigned an updated finding on ${req.body.product} with reference ${req.body.reference}.\r\rTitle: ${req.body.title}\r\rRaised by: ${req.body.project}\r\rPlease login to the Findings Manager to view more details.\n`;
        await sendEmail(
          assignee.local.email,
          "Updated finding assigned to you",
          text
        );
      } catch (error) {
        console.error(error);
      }

      res.redirect("/findings");
    } catch (error) {
      next(error);
    }
  }
};

exports.findingDelete = async (req, res, next) => {
  try {
    await deleteFinding(sanitize(String(req.params.id)));
    res.redirect("/findings");
  } catch (error) {
    next(error);
  }
};

exports.exportToCSV = async (req, res, next) => {
  try {
    const { projectReference } = sanitize(String(req.query));
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
    const finding = await findFindingPerId(sanitize(String(req.params.id)));
    const recipients = sanitize(String(req.body.recipients))
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email !== "");

    await Promise.all(
      recipients.map((recipient) =>
        sendEmail(
          recipient,
          `${req.user.username} shared a finding with you`,
          "", //no plaintext content
          `<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style>th,td{padding:5px;text-align:center;}</style></head><body class="bg-light"><div class="container"><div class="card my-10"><div class="card-body"><h2 class="mb-2">Hello,</h2><h5 class="text-cyan-700">A finding has been shared with you by ${
            req.user.username
          }: <a href="${finding.internalLink}">${
            finding.reference
          }</a></h5><hr><div class="space-y-3"><table style="border:1px solid #000;border-collapse:collapse;text-align:center"><tr style="background-color:#add8e6"><th style="border:1px solid #000">Type</th><th style="border:1px solid #000">Product</th><th style="border:1px solid #000">Severity</th><th style="border:1px solid #000">Due Date</th><th style="border:1px solid #000">Assigned to</th></tr><tr><td style="border:1px solid #000">${
            finding.type
          }</td><td style="border:1px solid #000">${
            finding.product
          }</td><td style="border:1px solid #000">${
            finding.severity
          }</td><td style="border:1px solid #000">${finding.dueDate.toDateString()}</td><td style="border:1px solid #000">${
            finding.assignee
          }</td></tr></table><h4>Title</h4><p class="text-gray-700">${
            finding.title
          }</p><h4>Description</h4><p class="text-gray-700">${
            finding.description
          }</p></div><hr><a class="btn btn-primary" href="https://127.0.0.1" target="_blank">Login the FindingsManager</a></div></div></div></body></html>`
          // `Hello,\n\nA finding has been shared with you:\n\n${finding.reference} - (${finding.severity}) ${finding.title} on ${finding.product}\n\nStatus: ${finding.status}\nAssignee: ${finding.assignee}\nOrigin: ${finding.origin}\nReported By: ${finding.reportedBy}\nDue Date: ${finding.dueDate}\n\nPlease login to the Findings Manager to view more details.\n`
        )
      )
    );
    res.redirect("/findings");
  } catch (error) {
    next(error);
  }
};
