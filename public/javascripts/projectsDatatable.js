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
  const showModal = (selector) => {
    const modal = new bootstrap.Modal(document.querySelector(selector));
    modal.show();
  };

  switch (action.trim()) {
    case "View Project":
      showModal(`#detailsModal-${projectId}`);
      break;
    case "Edit Project":
      showModal(`#editProjectModal-${projectId}`);
      break;
    case "Delete Project":
      showModal(`#deleteConfirmationModal-${projectId}`);
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
}
