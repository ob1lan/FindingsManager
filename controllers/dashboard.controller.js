const {
  getFindings,
  getCountBySeverity,
  getCountByStatus,
  getCountByProject,
  getCountByProduct,
  getCountByOrigin,
  getFindingsCountByDate,
  getOverdueFindings,
} = require("../queries/findings.queries");

const { getProjects } = require("../queries/projects.queries");

const puppeteer = require("puppeteer");
const path = require("path");

exports.getDashboard = async (req, res, next) => {
  try {
    const severityCounts = await getCountBySeverity();
    const statusCounts = await getCountByStatus();
    const sortedStatusData = sortStatusData(statusCounts);
    const sortedData = sortSeverityData(severityCounts);
    const findingsByProject = await getCountByProject();
    const findingsByProduct = await getCountByProduct();
    const findingsByOrigin = await getCountByOrigin();
    const findingsByDate7 = await getFindingsCountByDate(7);
    const findingsByDate30 = await getFindingsCountByDate(30);
    const allFindings = await getFindings();
    const allProjects = await getProjects();
    const numberOfFindings = allFindings.length;
    const numberOfOpenFindings = allFindings.filter(
      (finding) => finding.status === "In Remediation"
    ).length;
    const numberOfClosedFindings = allFindings.filter(
      (finding) => finding.status != "In Remediation"
    ).length;
    const numberOfFindingsOverdue = (await getOverdueFindings()).length;
    const activeProjects = allProjects.filter(
      (project) => project.status === "In Progress"
    );
    const numberOfActiveProjects = activeProjects.length;

    res.render("dashboard/dashboard", {
      sortedData,
      sortedStatusData,
      findingsByProject,
      findingsByProduct,
      findingsByOrigin,
      findingsByDate7,
      findingsByDate30,
      numberOfFindings,
      numberOfOpenFindings,
      numberOfClosedFindings,
      numberOfFindingsOverdue,
      numberOfActiveProjects,
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
    const overdueFindings = await getOverdueFindings();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(`
            <html>
                <head>
                    <style>
                        /* Add your CSS styles here */
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .report-title {
                            text-align: center;
                            font-size: 24px;
                            margin-top: 20px;
                        }
                        .user-info {
                            text-align: center;
                            font-size: 16px;
                            margin-top: 5px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 5px;
                            text-align: left;
                        }
                        th {
                            background-color: lightblue;
                            font-weight: bold;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        ul li {
                            margin-bottom: 5px;
                        }     
                    </style>
                </head>
                <body>
                    <h1 class="report-title">Overdue Findings Report</h1>
                    <h2 class="user-info">Generated by: ${
                      req.user.username
                    } on ${new Date().toLocaleDateString()}</h2>
                    <br />
                    <div id="content"></div>
                </body>
            </html>
        `);

    // Populate the content with findings
    await page.evaluate((findings) => {
      const contentDiv = document.getElementById("content");
      findings.forEach((finding) => {
        const findingDiv = document.createElement("div");
        findingDiv.innerHTML = `
                    <table>
                        <tr>
                            <th>Reference</th>
                            <th>Title</th>
                            <th>Severity</th>
                            <th>Due Date</th>
                        </tr>
                        <tr>
                            <td width="15%">${finding.reference}</td>
                            <td width="50%">${finding.title}</td>
                            <td width="10%">${finding.severity}</td>
                            <td width="25%">${new Date(
                              finding.dueDate
                            ).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <th width:"15%">CVSS</th>
                            <td width="50%">${finding.cvss}</td>
                            <th width:"10%">CVE</th>
                            <td width="25%">${finding.cve}</td>
                        </tr>
                    </table>
                    <ul>
                        <li><b>Type:</b> ${finding.type}</li>
                        <li><b>Origin:</b> ${finding.origin}</li>
                        <li><b>Reported by:</b> ${finding.reportedBy}</li>
                        <li><b>Assignee:</b> ${finding.assignee}</li>
                        <li><b>Description:</b> ${
                          finding.description
                        }</li>                        
                    </ul>
                    <br />
                    <hr />
                    <br />
                `;
        contentDiv.appendChild(findingDiv);
      });
    }, overdueFindings);

    // Generate PDF with footer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        bottom: "30mm",
        left: "20mm",
        right: "20mm",
      },
      displayHeaderFooter: true,
      headerTemplate:
        '<span id="confidential" style="font-size: 14px; font-weight: bold; width: 250px; height: 20px; color:red; margin: 20px;">Confidential - Internal Use Only</span>',
      footerTemplate:
        '<span id="pagination" style="font-size: 12px; width: 75px; height: 20px; color:black; margin: 20px;">Page <span class=pageNumber></span> of <span class="totalPages"></span></span>',
    });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=overdue_findings_report.pdf"
    );
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error generating report");
  }
};
