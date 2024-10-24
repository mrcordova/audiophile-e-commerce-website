const link = document.querySelector("[data-menu-item]");
const productBtns = document.querySelectorAll("[data-product]");
// console.log(link)

function goToPage(e) {
  window.location.href = `./product-${e.target.dataset.product}.html`;
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
