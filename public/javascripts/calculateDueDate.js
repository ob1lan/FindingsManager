function calculateDueDate() {
  var severity = document.getElementById("severity").value;
    console.log(severity);
  var daysToAdd = window.slaValues[severity.toLowerCase()];
    console.log(daysToAdd);
  var dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysToAdd);

  document.getElementById("dueDate").value = dueDate
    .toISOString()
    .split("T")[0];
  console.log(dueDate);
}

// Event listener for severity change
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  document
    .getElementById("severity")
    .addEventListener("change", calculateDueDate);

  // Initial calculation
  calculateDueDate();
});