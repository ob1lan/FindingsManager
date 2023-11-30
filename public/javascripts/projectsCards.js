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
