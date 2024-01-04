document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("newFindingForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    console.log("Form submission intercepted");
    console.log("CSRF Token:", csrfToken);
    fetch(form.action, {
      method: "POST",
      headers: {
        "CSRF-Token": csrfToken,
      },
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          $("#newFindingModal").modal("hide");
          location.reload();
        } else {
          // Handle error
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
