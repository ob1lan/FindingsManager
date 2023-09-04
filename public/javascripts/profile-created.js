document.addEventListener("DOMContentLoaded", function () {
  const findingsCreated = document.querySelectorAll(".paginatable-created-finding");
  let currentPageCreated = 1;
  const findingsPerPage = 5;
  const totalPages = Math.ceil(findingsCreated.length / findingsPerPage);

  function showPage(page) {
    const start = (page - 1) * findingsPerPage;
    const end = page * findingsPerPage;

    $(findingsListCreated).fadeOut(400, function () {
      findingsCreated.forEach((finding, index) => {
        finding.style.display = index >= start && index < end ? "" : "none";
      });
      $(findingsListCreated).fadeIn(400);
    });
  }

  document.getElementById("nextPage-created").addEventListener("click", function () {
    if (currentPageCreated < totalPages) {
      currentPageCreated++;
      showPage(currentPageCreated);
    }
  });

  document.getElementById("prevPage-created").addEventListener("click", function () {
    if (currentPageCreated > 1) {
      currentPageCreated--;
      showPage(currentPageCreated);
    }
  });

  showPage(currentPageCreated);
});
