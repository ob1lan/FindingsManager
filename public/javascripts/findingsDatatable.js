$(document).ready(function () {
  var table = $("table").DataTable({
    select: false,
    stateSave: true,
    responsive: true,
    dom: 'Bf<"clear">rtipl',
    buttons: [
      "copy",
      "colvis",
      {
        extend: "pdfHtml5",
        text: "Vue to PDF",
        orientation: "landscape",
        pageSize: "A4",
        download: "open",
        exportOptions: {
          columns: ":visible:not(:last-child)",
          modifier: {
            search: "applied",
            order: "applied",
          },
        },
      },
    ],
    columnDefs: [
      { targets: -1, orderable: false },
      { targets: [4, 10, 11, 13], visible: false },
    ],
    colReorder: true,
  });
  $("table tbody").on("dblclick", "tr", function () {
    var findingId = $(this).data("finding-id");
    if (findingId) {
      var modalSelector = `#detailsModal-${findingId}`;
      $(modalSelector).modal("show");
    }
  });

  // Right-click event on table row
  $("table tbody").on("contextmenu", "tr", function (event) {
    event.preventDefault();

    var findingId = $(this).data("finding-id"); // Assuming you've set this up
    var menu = $("#customContextMenu");

    // Position the menu at the cursor's location
    menu.css({ top: event.pageY, left: event.pageX, display: "block" });

    // Handle menu item clicks
    menu.off("click").on("click", "li", function () {
      var action = $(this).text();
      handleMenuAction(action, findingId);
      menu.hide();
    });
  });

  // Hide the menu when clicking elsewhere
  $(document).click(function () {
    $("#customContextMenu").hide();
  });
});
function handleMenuAction(action, findingId) {
  if (action === "View Details") {
    var modalSelector = `#detailsModal-${findingId}`;
    var modalInstance = new bootstrap.Modal(
      document.querySelector(modalSelector)
    );
    modalInstance.show();
  } else if (action === "Edit Finding") {
    var modalSelector2 = `#editFindingModal-${findingId}`;
    var modalInstance2 = new bootstrap.Modal(
      document.querySelector(modalSelector2)
    );
    modalInstance2.show();
  } else if (action === "Delete Finding") {
    var modalSelector3 = `#deleteFindingConfirmationModal-${findingId}`;
    var modalInstance3 = new bootstrap.Modal(
      document.querySelector(modalSelector3)
    );
    modalInstance3.show();
  }
}
