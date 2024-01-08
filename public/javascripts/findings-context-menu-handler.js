function handleMenuAction(action, findingId) {
  const showModal = (selector) => {
    const modal = new bootstrap.Modal(document.querySelector(selector));
    modal.show();
  };

  const updateFindingStatus = (status) => {
    axios
      .get(`/findings/${findingId}/details`)
      .then((response) => {
        const findingData = response.data;
        findingData.status = status;
        ["fixedDate", "timeToFix", "history"].forEach((field) => {
          delete findingData[field];
        });

        return axios.post(
          `/findings/${findingId}/edit`,
          new URLSearchParams(findingData).toString(),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "CSRF-Token": csrfToken,
            },
          }
        );
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error("Error updating the finding status");
        }
        location.reload();
      })
      .catch((error) => console.error(error.message));
  };

  switch (action.trim()) {
    case "Finding's History":
      showModal(`#historyModal-${findingId}`);
      break;
    case "Mark as Remediated":
    case "Mark as Accepted":
    case "Mark as Declined":
    case "Mark as In Remediation":
      const status = action.split("Mark as ")[1]; // Split the string and take the second part
      updateFindingStatus(status);
      break;
    case "View Finding":
      showModal(`#detailsModal-${findingId}`);
      break;
    case "Edit Finding":
      showModal(`#editFindingModal-${findingId}`);
      break;
    case "Delete Finding":
      showModal(`#deleteFindingConfirmationModal-${findingId}`);
      break;
    case "Share Finding":
      showModal(`#shareModal-${findingId}`);
      break;
    case "Report on Finding":
      axios
        .post(
          "/reporting/findings",
          new URLSearchParams({ findingId: findingId }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "CSRF-Token": csrfToken,
            },
            responseType: "blob", // Important for handling binary data
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
      break;
    default:
      console.error("Unknown action:", action);
  }
}
