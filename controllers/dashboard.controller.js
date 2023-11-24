const {
  getFindings,
  getCountBySeverity,
  getCountByStatus,
  getCountByProject,
  getCountByOrigin,
  getFindingsCountByDate,
  getOverdueFindings,
} = require("../queries/findings.queries");

const PDFDocument = require("pdfkit");

exports.getDashboard = async (req, res, next) => {
  try {
    const severityCounts = await getCountBySeverity();
    const statusCounts = await getCountByStatus();
    const sortedStatusData = sortStatusData(statusCounts);
    const sortedData = sortSeverityData(severityCounts);
    const findingsByProject = await getCountByProject();
    const findingsByOrigin = await getCountByOrigin();
    const findingsByDate7 = await getFindingsCountByDate(7);
    const findingsByDate30 = await getFindingsCountByDate(30);
    const allFindings = await getFindings();
    const numberOfFindings = allFindings.length;
    const numberOfOpenFindings = allFindings.filter(
      (finding) => finding.status === "In Remediation"
    ).length;
    const numberOfClosedFindings = allFindings.filter(
      (finding) => finding.status != "In Remediation"
    ).length;
    const numberOfFindingsOverdue = (await getOverdueFindings()).length;

    res.render("dashboard/dashboard", {
      sortedData,
      sortedStatusData,
      findingsByProject,
      findingsByOrigin,
      findingsByDate7,
      findingsByDate30,
      numberOfFindings,
      numberOfOpenFindings,
      numberOfClosedFindings,
      numberOfFindingsOverdue,
      isAuthenticated: req.isAuthenticated(),
      is2FAVerified: req.session.is2FAVerified,
      currentUser: req.user,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

function sortSeverityData(data) {
  const order = ["Critical", "High", "Medium", "Low", "Info"];
  const sorted = order.map((severity) => {
    const item = data.find((d) => d._id === severity) || { count: 0 };
    return item.count;
  });
  return sorted;
}

function sortStatusData(data) {
  const order = ["In Remediation", "Remediated", "Declined", "Accepted"];
  const sorted = order.map((status) => {
    const item = data.find((d) => d._id === status) || { count: 0 };
    return item.count;
  });
  return sorted;
}

exports.generateOverdueFindingsReport = async (req, res) => {
  try {
    const overdueFindings = await getOverdueFindings(); // Replace with your actual method to get findings
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=overdue_findings_report.pdf"
    );
    doc.pipe(res);

    // Document Title
    doc
      .fontSize(18)
      .text("Overdue Findings Report", { align: "center", underline: true });

    // User and Date Information
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Generated by: ${req.user.username}`, { align: "center" });
    doc.text(`Date: ${formattedDate}`, { align: "center" });
    doc.moveDown(2);

    // Table Headers and Content
    const headers = ["Reference", "Title", "Severity", "Due Date"];
    const columnWidths = [75, 275, 75, 75]; // Adjust as needed

    overdueFindings.forEach((finding) => {
      let y = doc.y;

      // Check for page break
      if (y > doc.page.height - 100) {
        // Adjust threshold as needed
        doc.addPage();
        y = doc.y; // Reset y to top of new page
      }

      // Draw Headers for each finding
      let xHeader = 50;
      headers.forEach((header, i) => {
        doc.save(); // Save the current state
        doc
          .rect(xHeader, y, columnWidths[i], 20)
          .fillAndStroke("lightblue", "black");
        doc
          .fillColor("black")
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(header, xHeader + 2, y + 5, {
            width: columnWidths[i] - 4,
            align: "center",
          });
        doc.restore(); // Restore to previous state
        xHeader += columnWidths[i];
      });
      y += 20;

      // Draw Table Rows with Borders
      let x = 50;
      headers.forEach((header, i) => {
        doc.rect(x, y, columnWidths[i], 20).stroke();
        let content = finding[header.toLowerCase()] || ""; // Adjust key names as needed
        if (header === "Due Date") {
          content = finding.dueDate
            ? new Date(finding.dueDate).toLocaleDateString()
            : "N/A";
        }
        doc
          .fontSize(12)
          .text(content, x + 2, y + 5, {
            width: columnWidths[i] - 4,
            align: "center",
          });
        x += columnWidths[i];
      });
      y += 20;

      // Add space before the list
      y += 10;

      // List for Type and Description
      doc.fontSize(12).text("Type:", 50, y);
      doc.text(finding.type, 150, y);
      y += 20;

      doc.fontSize(12).text("Description:", 50, y);
      doc.text(finding.description, 150, y);
      y += 20;

      // Add increased space before the next finding
      y += 20; // Increased space

      // Update the y position for the next finding
      doc.y = y;
    });

    doc.end();
  } catch (error) {
    res.status(500).send("Error generating report");
  }
};
