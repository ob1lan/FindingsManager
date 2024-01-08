window.addEventListener("DOMContentLoaded", () => {
  const forgot = document.querySelector("#forgot");
  if (forgot) {
    forgot.addEventListener("click", () => {
      Swal.fire({
        title: "Fill in your email address",
        input: "email",
        inputPlaceholder: "Email",
      }).then((result) => {
        const email = result.value;
        if (email) {
          axios
            .post(
              "/auth/forgot-password",
              {
                email: email,
              },
              {
                headers: {
                  "CSRF-Token": csrfToken,
                },
              }
            )
            .then((response) => {
              Swal.fire({
                icon: "success",
                title: "Vous avez reçu un email avec les instructions",
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: "error",
                title: "Une erreur est survenue",
              });
            });
        }
      });
    });
  }
});
