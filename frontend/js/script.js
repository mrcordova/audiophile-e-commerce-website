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
const main = document.querySelector("main");
const cartDialog = document.querySelector("#cartDialog");
const header = document.querySelector("header");
const VAT = 1.2;

// button.addEventListener("click", () => {
//   details.open = !details.open; // Toggles the open/close state of the details
// });

// const showBtns = document.querySelectorAll("[data-show-dialog]");
// console.log(link)
if (!("cart" in localStorage)) {
  localStorage.setItem("cart", JSON.stringify({}));
}
function checkRange(number, min = 1) {
  let n = Number(number);
  // n = Math.min(min, Math.max(0, n));
  n = Math.max(min, n);
  return n;
}

function goToPage(e) {
  window.location.href = `./product-${e.target.dataset.product}.html`;
}
function returnToPage(e) {
  history.back();
}

function updateCounter(counterBtn, min = 1) {
  const counterValue = counterBtn.parentElement.querySelector(
    "span[data-counter-value]"
  );

  const newVal = checkRange(
    parseInt(counterValue.dataset.counterValue) +
      parseInt(counterBtn.dataset.counterAmount),
    min
  );
  counterValue.setAttribute("data-counter-value", newVal);
  counterValue.textContent = newVal;
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
// orderConfirmationDialogBtn.addEventListener(
//   "click",
//   showOrderConfirmationDialog
// );

// for (const showBtn of showBtns) {
//   showBtn.addEventListener("click", showDialog);
// }
cartDialog.addEventListener("click", (e) => {
  const counterBtn = e.target.closest("button[data-counter-amount]");
  if (counterBtn) {
    const cartTotal = cartDialog.querySelector("[data-cart-total]");
    const priceEle = counterBtn.parentElement.querySelector("[data-price]");
    const itemTotal =
      parseFloat(priceEle.dataset.price) *
      parseFloat(counterBtn.dataset.counterAmount) *
      VAT;

    // console.log(itemTotal.toFixed(0));
    updateCounter(counterBtn, 0);

    const newTotal = Math.max(
      parseFloat(cartTotal.dataset.cartTotal) + parseInt(itemTotal.toFixed(0)),
      0
    );
    // console.log(newTotal);
    cartTotal.setAttribute("data-cart-total", newTotal);
    cartTotal.textContent = `${newTotal.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;

    if (priceEle.dataset.counterValue == "0") {
      priceEle.parentElement.parentElement.remove();
    }

    // console.log(cartTotal);
  }
});
main.addEventListener("click", (e) => {
  const counterBtn = e.target.closest("button[data-counter-amount]");
  const addCartBtn = e.target.closest("button[data-product-cart]");

  // console.log(e.target);
  if (counterBtn) {
    updateCounter(counterBtn);
  } else if (addCartBtn) {
    const counterVal = addCartBtn.previousElementSibling.querySelector(
      "span[data-counter-value]"
    ).dataset.counterValue;
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart[addCartBtn.dataset.productCart] = {
      amount: counterVal,
      price: addCartBtn.dataset.price,
    };
    // console.log(cart);
  }
});

header.addEventListener("click", (e) => {
  // console.log(e.target);
  const cartDialogBtn = e.target.closest("button[data-show-dialog]");
  if (cartDialogBtn) {
  }
});
