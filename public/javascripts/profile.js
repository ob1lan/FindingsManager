window.addEventListener("DOMContentLoaded", () => {
  const inputAvatar = document.querySelector("#input-avatar");
  const formContainer = document.querySelector("#form-container");

  formContainer.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });
});

document
  .getElementById("setup2FAButton")
  .addEventListener("click", function () {
    var modal = new bootstrap.Modal(document.getElementById("setup2FAModal"));
    modal.show();
  });
