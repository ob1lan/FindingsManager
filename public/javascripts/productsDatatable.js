$(document).ready(function () {
  $("table").DataTable();

  $("table tbody").on("dblclick", "tr", function () {
    var productId = $(this).data("product-id");
    if (productId) {
      var modalSelector = `#detailsModal-${productId}`;
      $(modalSelector).modal("show");
    }
  });

  // Right-click event on table row
  $("table tbody").on("contextmenu", "tr", function (event) {
    event.preventDefault();

    var productId = $(this).data("product-id");
    var menu = $("#customContextMenu");

    // Position the menu at the cursor's location
    menu.css({ top: event.pageY, left: event.pageX, display: "block" });

    // Handle menu item clicks
    menu.off("click").on("click", "li", function () {
      var action = $(this).text();
      handleMenuAction(action, productId);
      menu.hide();
    });

    $(document).click(function () {
      $("#customContextMenu").hide();
    });
  });
});

function handleMenuAction(action, productId) {
  const showModal = (selector) => {
    const modal = new bootstrap.Modal(document.querySelector(selector));
    modal.show();
  };

  switch (action.trim()) {
    case "View Product":
      showModal(`#detailsModal-${productId}`);
      break;
    case "Edit Product":
      showModal(`#editProductModal-${productId}`);
      break;
    case "Delete Product":
      showModal(`#deleteConfirmationModal-${productId}`);
      break;
    default:
      console.error(`Unknown action: ${action}`);
  }
}
