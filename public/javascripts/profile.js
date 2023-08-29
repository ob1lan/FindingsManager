window.addEventListener("DOMContentLoaded", () => {
  const inputAvatar = document.querySelector("#input-avatar");
  const formContainer = document.querySelector("#form-container");

  formContainer.addEventListener("click", () => {
    inputAvatar.click();
  });

  inputAvatar.addEventListener("change", () => {
    formContainer.submit();
  });

  const otpForm = document.querySelector("#setup2FAModal form");
  const errorMessage = document.querySelector("#error-message");

  otpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(otpForm);
    console.error(
      "Sending OTP and Secret:",
      formData.get("otp"),
      formData.get("secret")
    );

    try {
      const response = await axios.post("/users/verify-2fa", formData);
      if (response.data.success) {
        window.location.href = "/users/profile";
      } else {
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  });
});
