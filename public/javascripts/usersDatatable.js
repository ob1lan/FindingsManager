$(document).ready(function () {
  $("table").DataTable();

  $("table tbody").on("dblclick", "tr", function () {
    var userId = $(this).data("user-id");
    if (userId) {
      var modalSelector = `#detailsModal-${userId}`;
      $(modalSelector).modal("show");
    }
  });

  // Right-click event on table row
  $("table tbody").on("contextmenu", "tr", function (event) {
    event.preventDefault();

    var userId = $(this).data("user-id");
    var menu = $("#customContextMenu");

    // Position the menu at the cursor's location
    menu.css({ top: event.pageY, left: event.pageX, display: "block" });

    // Handle menu item clicks
    menu.off("click").on("click", "li", function () {
      var action = $(this).text();
      handleMenuAction(action, userId);
      menu.hide();
    });

    $(document).click(function () {
      $("#customContextMenu").hide();
    });
  });
});

function handleMenuAction(action, userId) {
  const showModal = (selector) => {
    const modal = new bootstrap.Modal(document.querySelector(selector));
    modal.show();
  };

  switch (action.trim()) {
    case "View User":
      showModal(`#detailsModal-${userId}`);
      break;
    case "Edit User":
      showModal(`#editUserModal-${userId}`);
      break;
    case "Delete User":
      showModal(`#userdeleteConfirmationModal-${userId}`);
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
}
