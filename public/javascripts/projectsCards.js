projects.forEach((project) => {
  const projectFindings = findings.filter(
    (finding) =>
      finding.project === project.reference &&
      finding.status === "In Remediation"
  );
  document.getElementById(`findingsCount-${project._id}`).innerText =
    projectFindings.length;

  const criticalFindings = findings.filter(
    (finding) =>
      finding.project === project.reference && finding.severity === "Critical"
  );
  document.getElementById(`criticalFindingsCount-${project._id}`).innerText =
    criticalFindings.length;

  const highFindings = findings.filter(
    (finding) =>
      finding.project === project.reference && finding.severity === "High"
  );
  document.getElementById(`highFindingsCount-${project._id}`).innerText =
    highFindings.length;

  const mediumFindings = findings.filter(
    (finding) =>
      finding.project === project.reference && finding.severity === "Medium"
  );
  document.getElementById(`mediumFindingsCount-${project._id}`).innerText =
    mediumFindings.length;

  const lowFindings = findings.filter(
    (finding) =>
      finding.project === project.reference && finding.severity === "Low"
  );
  document.getElementById(`lowFindingsCount-${project._id}`).innerText =
    lowFindings.length;

  const infoFindings = findings.filter(
    (finding) =>
      finding.project === project.reference && finding.severity === "Info"
  );
  document.getElementById(`infoFindingsCount-${project._id}`).innerText =
    infoFindings.length;

  const closedFindings = findings.filter(
    (finding) =>
      finding.project === project.reference &&
      finding.status !== "In Remediation"
  );
  document.getElementById(`closedFindingsCount-${project._id}`).innerText =
    closedFindings.length;
});

function handleCSVClick(projectId) {
  // TO DO
  console.log("CSV link clicked for project:", projectId);
}

function handlePDFClick(projectRef) {
  axios
    .post(
      "/reporting/multiple-findings",
      new URLSearchParams({ projectRef: projectRef }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "CSRF-Token": csrfToken,
        },
        responseType: "blob", // Important for handling binary data like PDF
      }
    )
    .then((response) => {
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const tempLink = document.createElement("a");
      tempLink.href = fileURL;
      tempLink.download = "findings_report.pdf";
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
