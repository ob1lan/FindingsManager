const e = require("connect-flash");

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("newFindingForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(form);
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
          next(e);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
