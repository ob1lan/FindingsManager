document.addEventListener("DOMContentLoaded", function () { 
  const findings = document.querySelectorAll(".paginatable-assigned-finding");
  let currentPage = 1;
  const findingsPerPage = 5;
  const totalPages = Math.ceil(findings.length / findingsPerPage);

  function showPage(page) {
    const start = (page - 1) * findingsPerPage;
    const end = page * findingsPerPage;

    $(findingsList).fadeOut(400, function () {
      findings.forEach((finding, index) => {
        finding.style.display = index >= start && index < end ? "" : "none";
      });
      $(findingsList).fadeIn(400);
    });
  }

  document.getElementById("nextPage").addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });

  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });

  showPage(currentPage);
});
