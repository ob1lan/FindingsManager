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
  if (action === " View User") {
    var modalSelector = `#detailsModal-${userId}`;
    var modalInstance = new bootstrap.Modal(
      document.querySelector(modalSelector)
    );
    modalInstance.show();
  } else if (action === " Edit User") {
    var modalSelector2 = `#editUserModal-${userId}`;
    var modalInstance2 = new bootstrap.Modal(
      document.querySelector(modalSelector2)
    );
    modalInstance2.show();
  } else if (action === " Delete User") {
    var modalSelector3 = `#userdeleteConfirmationModal-${userId}`;
    var modalInstance3 = new bootstrap.Modal(
      document.querySelector(modalSelector3)
    );
    modalInstance3.show();
  }
}
