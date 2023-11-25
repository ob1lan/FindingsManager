document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toggleForm = document.getElementById("toggle-form");
  const toggleText = document.getElementById("toggle-text");
  const toggleStaticText = document.getElementById("toggle-static-text");

  if (loginForm && registerForm && toggleForm) {
    toggleForm.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.classList.toggle("hidden");
      registerForm.classList.toggle("hidden");

      // Update the text content of the link and static text
      if (loginForm.classList.contains("hidden")) {
        toggleStaticText.textContent = "Already have an account?";
        toggleText.textContent = "Sign In";
      } else {
        toggleStaticText.textContent = "Don't have an account?";
        toggleText.textContent = "Create One";
      }
    });
  }
});
