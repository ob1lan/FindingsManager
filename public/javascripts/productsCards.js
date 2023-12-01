products.forEach((product) => {
  const productFindings = findings.filter(
    (finding) =>
      finding.product === product.reference &&
      finding.status === "In Remediation"
  );
  document.getElementById(`findingsCount-${product._id}`).innerText =
    productFindings.length;

  const criticalFindings = findings.filter(
    (finding) =>
      finding.product === product.reference && finding.severity === "Critical"
  );
  document.getElementById(`criticalFindingsCount-${product._id}`).innerText =
    criticalFindings.length;

  const highFindings = findings.filter(
    (finding) =>
      finding.product === product.reference && finding.severity === "High"
  );
  document.getElementById(`highFindingsCount-${product._id}`).innerText =
    highFindings.length;

  const mediumFindings = findings.filter(
    (finding) =>
      finding.product === product.reference && finding.severity === "Medium"
  );
  document.getElementById(`mediumFindingsCount-${product._id}`).innerText =
    mediumFindings.length;

  const lowFindings = findings.filter(
    (finding) =>
      finding.product === product.reference && finding.severity === "Low"
  );
  document.getElementById(`lowFindingsCount-${product._id}`).innerText =
    lowFindings.length;

  const infoFindings = findings.filter(
    (finding) =>
      finding.product === product.reference && finding.severity === "Info"
  );
  document.getElementById(`infoFindingsCount-${product._id}`).innerText =
    infoFindings.length;

  const closedFindings = findings.filter(
    (finding) =>
      finding.product === product.reference &&
      finding.status !== "In Remediation"
  );
  document.getElementById(`closedFindingsCount-${product._id}`).innerText =
    closedFindings.length;
});

function handleCSVClick(projectId) {
  // Your JavaScript code here
  console.log("CSV link clicked for product:", product);
  // Add your logic to handle the click event
}

function handlePDFClick(productRef) {
  // Your JavaScript code here
  console.log("PDF link clicked for product:", productRef);
  // Add your logic to handle the click event
  fetch("/reporting/multiple-findings", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `productRef=${productRef}`,
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create a new blob object using the 'application/pdf' mime type
      const file = new Blob([blob], { type: "application/pdf" });
      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);
      // Create a temporary anchor element
      const tempLink = document.createElement("a");
      tempLink.href = fileURL;
      tempLink.download = "findings_report.pdf"; // You can name the file here
      document.body.appendChild(tempLink); // Append to the body
      tempLink.click(); // Programmatically click the link to trigger the download
      document.body.removeChild(tempLink); // Remove the link when done
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
