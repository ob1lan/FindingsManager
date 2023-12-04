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
  if (action === " View Product") {
    var modalSelector = `#detailsModal-${productId}`;
    var modalInstance = new bootstrap.Modal(
      document.querySelector(modalSelector)
    );
    modalInstance.show();
  } else if (action === " Edit Product") {
    var modalSelector2 = `#editProductModal-${productId}`;
    var modalInstance2 = new bootstrap.Modal(
      document.querySelector(modalSelector2)
    );
    modalInstance2.show();
  } else if (action === " Delete Product") {
    var modalSelector3 = `#deleteConfirmationModal-${productId}`;
    var modalInstance3 = new bootstrap.Modal(
      document.querySelector(modalSelector3)
    );
    modalInstance3.show();
  }
}