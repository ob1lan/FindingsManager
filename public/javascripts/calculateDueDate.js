function calculateDueDate() {
  // Target both new and edit severity dropdowns
  var severityElements = document.querySelectorAll(".severity-dropdown");
  severityElements.forEach(function (severityElement) {
    var severity = severityElement.value;
    var daysToAdd = window.slaValues[severity.toLowerCase()];
    var dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);

    // Find the corresponding due date input for each severity dropdown
    var dueDateElement = severityElement
      .closest(".modal-body")
      .querySelector(".due-date-input");
    dueDateElement.value = dueDate.toISOString().split("T")[0];
  });
}

// Event listener for severity change in both new and edit modals
document.addEventListener("DOMContentLoaded", function () {
  var severityElements = document.querySelectorAll(".severity-dropdown");
  severityElements.forEach(function (severityElement) {
    severityElement.addEventListener("change", calculateDueDate);
  });

  // Initial calculation for all severity dropdowns
  calculateDueDate();
});
