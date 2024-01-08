function handleMenuAction(action, findingId) {
  if (action === " Finding's History") {
    var modalSelector5 = `#historyModal-${findingId}`;
    var modalInstance5 = new bootstrap.Modal(
      document.querySelector(modalSelector5)
    );
    modalInstance5.show();
  }
  if (action === "  Mark as Remediated") {
    // Retrieve the current finding data
    fetch(`/findings/${findingId}/details`)
      .then((response) => response.json())
      .then((findingData) => {
        // Update the status of the finding
        findingData.status = "Remediated";

        if (!findingData.fixedDate || findingData.fixedDate === "null") {
          delete findingData.fixedDate;
        }

        if (!findingData.timeToFix || findingData.timeToFix === "null") {
          delete findingData.timeToFix;
        }

        // Send the updated finding data in a POST request
        fetch(`/findings/${findingId}/edit`, {
          method: "POST",
          headers: {
            "CSRF-Token": csrfToken,
          },
          body: new URLSearchParams(findingData).toString(),
        })
          .then((response) => {
            if (response.ok) {
              // Refresh the DataTable or show a success message
              location.reload(); // Simple page reload to reflect changes
            } else {
              // Handle error
              console.error("Error updating the finding status");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving finding data:", error);
      });
  }
  if (action === " Mark as Accepted") {
    // Retrieve the current finding data
    fetch(`/findings/${findingId}/details`)
      .then((response) => response.json())
      .then((findingData) => {
        // Update the status of the finding
        findingData.status = "Accepted";

        // Send the updated finding data in a POST request
        fetch(`/findings/${findingId}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "CSRF-Token": csrfToken,
          },
          body: new URLSearchParams(findingData).toString(),
        })
          .then((response) => {
            if (response.ok) {
              // Refresh the DataTable or show a success message
              location.reload(); // Simple page reload to reflect changes
            } else {
              // Handle error
              console.error("Error updating the finding status");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving finding data:", error);
      });
  }
  if (action === " Mark as Declined") {
    // Retrieve the current finding data
    fetch(`/findings/${findingId}/details`)
      .then((response) => response.json())
      .then((findingData) => {
        // Update the status of the finding
        findingData.status = "Declined";

        // Send the updated finding data in a POST request
        fetch(`/findings/${findingId}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "CSRF-Token": csrfToken,
          },
          body: new URLSearchParams(findingData).toString(),
        })
          .then((response) => {
            if (response.ok) {
              // Refresh the DataTable or show a success message
              location.reload(); // Simple page reload to reflect changes
            } else {
              // Handle error
              console.error("Error updating the finding status");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving finding data:", error);
      });
  }
  if (action === "  Mark as In Remediation") {
    // Retrieve the current finding data
    fetch(`/findings/${findingId}/details`)
      .then((response) => response.json())
      .then((findingData) => {
        // Update the status of the finding
        findingData.status = "In Remediation";

        // Send the updated finding data in a POST request
        fetch(`/findings/${findingId}/edit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "CSRF-Token": csrfToken,
          },
          body: new URLSearchParams(findingData).toString(),
        })
          .then((response) => {
            if (response.ok) {
              // Refresh the DataTable or show a success message
              location.reload(); // Simple page reload to reflect changes
            } else {
              // Handle error
              console.error("Error updating the finding status");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error retrieving finding data:", error);
      });
  }
  if (action === " View Finding") {
    var modalSelector = `#detailsModal-${findingId}`;
    var modalInstance = new bootstrap.Modal(
      document.querySelector(modalSelector)
    );
    modalInstance.show();
  } else if (action === " Edit Finding") {
    var modalSelector2 = `#editFindingModal-${findingId}`;
    var modalInstance2 = new bootstrap.Modal(
      document.querySelector(modalSelector2)
    );
    modalInstance2.show();
  } else if (action === " Delete Finding") {
    var modalSelector3 = `#deleteFindingConfirmationModal-${findingId}`;
    var modalInstance3 = new bootstrap.Modal(
      document.querySelector(modalSelector3)
    );
    modalInstance3.show();
  } else if (action === " Share Finding") {
    var modalSelector4 = `#shareModal-${findingId}`;
    var modalInstance4 = new bootstrap.Modal(
      document.querySelector(modalSelector4)
    );
    modalInstance4.show();
  } else if (action === "  Report on Finding") {
    // Make a POST request with fetch to /reporting/findings with data {findingId: findingId}
    fetch("/reporting/findings", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "CSRF-Token": csrfToken,
      },
      body: `findingId=${findingId}`,
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
}
