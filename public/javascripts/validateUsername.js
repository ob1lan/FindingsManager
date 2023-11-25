document.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.querySelector('input[name="username"]');
  usernameInput.addEventListener("input", function () {
    if (this.value.length > 8) {
      // Display a warning message
      // Example: Update the text of a <span> element with an error message
      document.getElementById("usernameError").textContent =
        "Username cannot be more than 8 characters.";
    } else {
      // Clear the warning message
      document.getElementById("usernameError").textContent = "";
    }
  });
});
