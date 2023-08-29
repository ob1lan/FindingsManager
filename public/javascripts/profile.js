window.addEventListener("DOMContentLoaded", () => {
  const otpForm = document.querySelector("#setup2FAModal form");
  const errorMessage = document.querySelector("#error-message");

  otpForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const otpValue = document.querySelector("input[name='otp']").value;
    const secretValue = document.querySelector("input[name='secret']").value;

    try {
      const response = await axios.post("/users/verify-2fa", {
        otp: otpValue,
        secret: secretValue,
      });

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