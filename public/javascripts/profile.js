window.addEventListener("DOMContentLoaded", () => {
  const inputAvatar = document.querySelector("#input-avatar");
  const formContainer = document.querySelector("#form-container");
  const setup2FAButton = document.getElementById("setup2FAButton");

  formContainer.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });

  if (setup2FAButton) {
    setup2FAButton.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
});
