function validateFindingReference() {
  var inputRef = document.getElementById("reference").value;
  var isDuplicate = findings.some(
    (finding) => finding.reference === inputRef
  );
  var errorMessage = document.getElementById("referenceError");
  var submitBtn = document.getElementById("submitBtn");

  if (isDuplicate) {
    errorMessage.textContent = "This Finding ID already exists!";
    errorMessage.style.display = "block";
    submitBtn.disabled = true;
  } else {
    errorMessage.style.display = "none";
    submitBtn.disabled = false;
  }
}
