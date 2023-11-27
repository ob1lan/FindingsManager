$(document).ready(function () {
  function sanitizeInput(input) {
    var div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  function getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split("=");
      vars.push(hash[0]);
      vars[hash[0]] = sanitizeInput(decodeURIComponent(hash[1]));
    }
    return vars;
  }

  var searchTerm = getUrlVars()["search"];

  var table = $("table").DataTable({
    select: true,
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
    stateLoadParams: function (settings, data) {
      // Override the search term in the saved state if there's a URL parameter
      if (searchTerm) {
        data.search.search = searchTerm;
      } else {
        // If no search term in URL, clear the saved search term
        data.search.search = "";
      }
    },
    // Initialize the search with the URL parameter if present
    search: {
      search: searchTerm,
    },
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
