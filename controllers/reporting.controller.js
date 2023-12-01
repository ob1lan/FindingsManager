const {
  findFindingPerId,
  getFindingsByProjectReference,
  getFindingsByProductReference,
  getFindings,
} = require("../queries/findings.queries");

const puppeteer = require("puppeteer");

exports.generateFindingsReport = async (req, res, next) => {
  try {
    const findingId = req.body.findingId;
    const finding = await findFindingPerId(findingId);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content of the page
    await page.setContent(`
            <html>
                <head>
                    <style>
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
                    <h1 class="report-title">Findings Report</h1>
                    <h2 class="user-info">Generated by: ${
                      req.user.username
                    } on ${new Date().toLocaleDateString()}</h2>
                    <br />
                    <div id="content"></div>
                </body>
            </html>
        `);

    // Populate the content with findings
    await page.evaluate((finding) => {
      const contentDiv = document.getElementById("content");
      const findingDiv = document.createElement("div");
      findingDiv.innerHTML = `
                    <h2>Finding ${finding.reference} raised by ${
        finding.project
      }</h2>
                    <table>
                        <tr>
                            <th>Origin</th>
                            <th>Product</th>
                            <th>Severity</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                        <tr>
                            <td width="10%">${finding.origin}</td>    
                            <td width="40%">${finding.product}</td>
                            <td width="10%">${finding.severity}</td>
                            <td width="15%">${new Date(
                              finding.dueDate
                            ).toLocaleDateString()}</td>
                            <td width="25%">${finding.status}</td>
                        </tr>
                    </table>
                    <ul>
                              <li><b>CVSS:</b> ${finding.cvss}</li>
                              <li><b>CVE:</b> ${finding.cve}</li>
                              <li><b>Reported by:</b> ${finding.reportedBy}</li>
                              <li><b>Assigned to:</b> ${finding.assignee}</li>
                    </ul>
                    <h3>Description</h3>
                    <p>${finding.description}</p>
                    <p><b>Created on:</b> ${new Date(
                      finding.createdAt
                    ).toLocaleDateString()}</p>
                    <br />
                    <hr />
                    <br />
                `;
      contentDiv.appendChild(findingDiv);
    }, finding);

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
      "attachment; filename=findings_report.pdf"
    );
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).send("Error:" + error);
  }
};

exports.generateMultipleFindingsReport = async (req, res) => {
  try {
    let reportedFindings;
    let reportTitle;

    if (req.body.projectRef) {
      const projectRef = req.body.projectRef;
      reportedFindings = await getFindingsByProjectReference(projectRef);
      reportTitle = projectRef;
    } else if (req.body.productRef) {
      const productRef = req.body.productRef;
      reportedFindings = await getFindingsByProductReference(productRef);
      reportTitle = productRef;
    } else {
      reportedFindings = await getFindings();
      reportTitle = "All Fingings";
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let contentHtml = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { font-size: 42px; }
            .user-info { text-align: center; font-size: 16px; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; }
            th { background-color: lightblue; font-weight: bold; }
            ul { list-style-type: none; padding: 0; }
            ul li { margin-bottom: 5px; }
            .content-link { text-decoration: none; color: black; }
            .page-break { page-break-after: always; }
            .front-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh; /* Full viewport height */
            }
          </style>
        </head>
        <body>
          <div class="front-page"">
            <h1>Findings Report</h1>
            <h2>${reportTitle}</h2>
            <p class="user-info">Generated by: ${
              req.user.username
            } on ${new Date().toLocaleDateString()}</p>
          </div>
    `;

    // Table of Contents on a separate page
    contentHtml += `
      <div>
        <h2>Table of Contents</h2>
        <ul>
    `;

    // Table of Contents
    reportedFindings.forEach((finding) => {
      contentHtml += `<li><a class="content-link" href="#finding-${finding.reference}">Finding ${finding.reference}</a></li>`;
    });

    contentHtml += `
        </ul>
      </div>
      <div class="page-break"></div>
    `;

    // Findings Details
    reportedFindings.forEach((finding) => {
      contentHtml += `
        <div id="finding-${finding.reference}">
          <h2>Finding ${finding.reference} raised by ${finding.project}</h2>
          <table>
            <tr>
              <th>Origin</th>
              <th>Product</th>
              <th>Severity</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>${finding.origin}</td>
              <td>${finding.product}</td>
              <td>${finding.severity}</td>
              <td>${new Date(finding.dueDate).toLocaleDateString()}</td>
              <td>${finding.status}</td>
            </tr>
          </table>
          <ul>
            <li><b>CVSS:</b> ${finding.cvss}</li>
            <li><b>CVE:</b> ${finding.cve}</li>
            <li><b>Reported by:</b> ${finding.reportedBy}</li>
            <li><b>Assigned to:</b> ${finding.assignee}</li>
          </ul>
          <h3>Description</h3>
          <p>${finding.description}</p>
          <p><b>Created on:</b> ${new Date(
            finding.createdAt
          ).toLocaleDateString()}</p>
          <hr />
        </div>
      `;
    });

    contentHtml += `</body></html>`;

    // Set the combined content
    await page.setContent(contentHtml);

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
      "attachment; filename=findings_report.pdf"
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Error generating report");
  }
};
