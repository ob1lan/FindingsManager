window.addEventListener("DOMContentLoaded", () => {
  const otpForm = document.querySelector("#setup2FAModal form");
  const errorMessage = document.querySelector("#error-message");

  otpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const otpValue = document.querySelector("input[name='otp']").value;
    const secretValue = document.querySelector("input[name='secret']").value;
    const csrfToken = document.querySelector("input[name='_csrf']").value;

    try {
      const response = await axios.post("/me/verify-2fa", {
        otp: otpValue,
        secret: secretValue,
        _csrf: csrfToken,
      });

      if (response.data.success) {
        window.location.href = "/me/profile";
      } else {
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  });

  const inputAvatar = document.querySelector("#input-avatar");
  const formContainer = document.querySelector("#form-container");
  const imgavatar = document.querySelector("#image-profile");

  // Change opacity and show icon when mouse hovers over the image
  imgavatar.addEventListener("mouseover", function () {
    this.style.opacity = "0.5";
  });

  // Reset opacity and hide icon when mouse leaves the image
  imgavatar.addEventListener("mouseout", function () {
    this.style.opacity = "1";
  });

  imgavatar.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });
});

// initTooltips.js
document.addEventListener('DOMContentLoaded', () => {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});