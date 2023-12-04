$(document).ready(function () {
  $("table").DataTable();

  $("table tbody").on("dblclick", "tr", function () {
    var projectId = $(this).data("project-id");
    if (projectId) {
      var modalSelector = `#detailsModal-${projectId}`;
      $(modalSelector).modal("show");
    }
  });

  // Right-click event on table row
  $("table tbody").on("contextmenu", "tr", function (event) {
    event.preventDefault();

    var projectId = $(this).data("project-id");
    var menu = $("#customContextMenu");

    // Position the menu at the cursor's location
    menu.css({ top: event.pageY, left: event.pageX, display: "block" });

    // Handle menu item clicks
    menu.off("click").on("click", "li", function () {
      var action = $(this).text();
      handleMenuAction(action, projectId);
      menu.hide();
    });

     $(document).click(function () {
       $("#customContextMenu").hide();
     });
  });
});

function handleMenuAction(action, projectId) {
  if (action === " View Project") {
    var modalSelector = `#detailsModal-${projectId}`;
    var modalInstance = new bootstrap.Modal(
      document.querySelector(modalSelector)
    );
    modalInstance.show();
  } else if (action === " Edit Project") {
    var modalSelector2 = `#editProjectModal-${projectId}`;
    var modalInstance2 = new bootstrap.Modal(
      document.querySelector(modalSelector2)
    );
    modalInstance2.show();
  } else if (action === " Delete Project") {
    var modalSelector3 = `#deleteConfirmationModal-${projectId}`;
    var modalInstance3 = new bootstrap.Modal(
      document.querySelector(modalSelector3)
    );
    modalInstance3.show();
  }
}