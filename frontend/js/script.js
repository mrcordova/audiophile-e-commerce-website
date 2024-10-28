const link = document.querySelector("[data-menu-item]");
const productBtns = document.querySelectorAll("[data-product]");
const returnBtns = document.querySelectorAll("[data-return]");
const orderConfirmationDialog = document.querySelector(
  "#orderConfirmationDialog"
);
const orderConfirmationDialogBtn = document.querySelector(
  "[data-show-dialog='orderConfirmation']"
);
const details = document.querySelector(".item-details");
const button = document.querySelector(".toggle-button");

button.addEventListener("click", () => {
  details.open = !details.open; // Toggles the open/close state of the details
});

// const showBtns = document.querySelectorAll("[data-show-dialog]");
// console.log(link)

function goToPage(e) {
  window.location.href = `./product-${e.target.dataset.product}.html`;
}
function returnToPage(e) {
  history.back();
}
// function showDialog(e) {
//   const cartDialog = document.getElementById("cartDialog");
//   cartDialog.showModal();
// }
function showOrderConfirmationDialog(e) {
  const orderConfirmationDialog = document.querySelector(
    "#orderConfirmationDialog"
  );
  orderConfirmationDialog.showModal();
}
link.addEventListener("click", (e) => {
  //   e.preventDefault();

  // Prevent the default immediate navigation
  //   e.preventDefault();

  console.log("here");

  // Wait 5 seconds (5000 milliseconds) before navigating to the href
  //   setTimeout(function () {
  // Navigate to the href after the delay
  // window.location.href = link.href;
  //   }, 5000);

  return false;
});
for (const productBtn of productBtns) {
  productBtn.addEventListener("click", goToPage);
}

for (const returnBtn of returnBtns) {
  returnBtn.addEventListener("click", returnToPage);
}
orderConfirmationDialogBtn.addEventListener(
  "click",
  showOrderConfirmationDialog
);

// for (const showBtn of showBtns) {
//   showBtn.addEventListener("click", showDialog);
// }
