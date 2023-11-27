// window.addEventListener("DOMContentLoaded", () => {
//   const overdueCardBody = document.querySelector("#overdueCardBody");

//   // Change opacity and show icon when mouse hovers over the image
//   overdueCardBody.addEventListener("mouseover", function () {
//     this.style.opacity = "0.5";
//   });

//   // Reset opacity and hide icon when mouse leaves the image
//   overdueCardBody.addEventListener("mouseout", function () {
//     this.style.opacity = "1";
//   });

//   overdueCardBody.addEventListener("click", () => {
//     generateOverdueFindingsReport();
//   });
// });

window.addEventListener("DOMContentLoaded", () => {
  const overdueCardBody = document.querySelector("#overdueCardBody");
  const overdueIcon = overdueCardBody.querySelector(".overdue-icon");
  const overdueNumber = overdueCardBody.querySelector(".overdue-number");

  // Show icon and change opacity when mouse hovers over the element
  overdueCardBody.addEventListener("mouseover", function () {
    // this.style.opacity = "0.5";
    overdueIcon.style.display = "block"; // Show the icon
    overdueNumber.style.color = "#dc3545"; // Hide the number
  });

  // Hide icon and reset opacity when mouse leaves the element
  overdueCardBody.addEventListener("mouseout", function () {
    this.style.opacity = "1";
    overdueIcon.style.display = "none"; // Hide the icon
    overdueNumber.style.color = "white"; // Show the number
  });

  overdueCardBody.addEventListener("click", () => {
    generateOverdueFindingsReport();
  });
});