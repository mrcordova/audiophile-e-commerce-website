import { VAT, priceOptions } from "./script.js";

// console.log(VAT);
if (!("cart" in localStorage)) {
  localStorage.setItem("cart", JSON.stringify({}));
}
const isNum = (val) => /^\d+[.]*\d*$/.test(val);
const orderConfirmationDialog = document.querySelector(
  "#orderConfirmationDialog"
);
const orderConfirmationDialogBtn = document.querySelector(
  "[data-show-dialog='orderConfirmation']"
);
const details = document.querySelector(".item-details");
const button = document.querySelector(".toggle-button");
const cart = JSON.parse(localStorage.getItem("cart"));
let cartTotal = 0;
const cartItems = document.querySelector(".checkout-summary .cart-items");
const total = document.querySelector(".checkout-summary [data-total]");
const vat = document.querySelector(".checkout-summary [data-vat]");
const shipping = document.querySelector(".checkout-summary [data-shipping]");
const grandTotal = document.querySelector(
  ".checkout-summary [data-grand-total]"
);
const main = document.querySelector("main");
const checkoutForm = main.querySelector("#checkout-form");
const backHomeBtn = document.querySelector(".back-home-btn");

cartItems.replaceChildren();

function showOrderConfirmationDialog(e) {
  //   const orderConfirmationDialog = document.querySelector(
  //     "#orderConfirmationDialog"
  //   );

  if (checkoutForm.checkValidity()) {
    orderConfirmationDialog.showModal();
    const displayItem = orderConfirmationDialog.querySelector(
      ".order-confirm-accordian > .cart-item-cont"
    );
    const detailsItem = orderConfirmationDialog.querySelector(
      "details > .cart-items"
    );
    const summaryEle = orderConfirmationDialog.querySelector("summary");
    const grandTotal = main.querySelector(".cart-total > [data-grand-total]");
    const grandTotalPara = orderConfirmationDialog.querySelector(
      ".order-confirm-total > [data-grand-total]"
    );
    let itemsToDisplay = 0;

    displayItem.replaceChildren();
    detailsItem.replaceChildren();
    Object.entries(cart).forEach((val, idx) => {
      const price = parseInt(val[1].price).toLocaleString(
        "en-US",
        priceOptions
      );
      if (idx == 0) {
        displayItem.insertAdjacentHTML(
          "beforeend",
          `<img
              src="${val[1].image}"              
              alt="${val[0]}" />
            <div class="cart-item-info manrope-bold">
              <p>${val[0]}</p>
              <p class="amount">${price}</p>
            </div>
            <p class="quantity">x${val[1].amount}</p>`
        );
      } else {
        detailsItem.insertAdjacentHTML(
          "beforeend",
          `<div class="cart-item-cont">
                <img
                src="${val[1].image}"              
                alt="${val[0]}" />
                <div class="cart-item-info manrope-bold">
                    <p>${val[0]}</p>
                    <p class="amount">${price}</p>
                </div>
                <p class="quantity">x${val[1].amount}</p>
            </div>`
        );
        itemsToDisplay++;
      }
    });

    summaryEle.textContent = `and ${itemsToDisplay} other item(s)`;

    grandTotalPara.textContent = `${parseInt(
      grandTotal.dataset.grandTotal
    ).toLocaleString("en-US", priceOptions)}`;
    //   const cart = localStorage.getItem('cart')
  } else {
    // console.log(checkoutForm.validity);

    checkoutForm.reportValidity();
  }
}

backHomeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.setItem("cart", JSON.stringify({}));
  window.location.href = e.target.href;
});
button.addEventListener("click", () => {
  details.open = !details.open; // Toggles the open/close state of the details
});

for (const [name, valuesObj] of Object.entries(cart)) {
  const price = parseInt(valuesObj.price).toLocaleString("en-US", priceOptions);
  cartItems.insertAdjacentHTML(
    "beforeend",
    ` <div class="cart-item-cont">
                <img
                  src="${valuesObj.image}"
                  alt="${name}" />
                <div class="cart-item-info manrope-bold">
                  <p>${name}</p>
                  <p class="amount">${price}</p>
                </div>
                <p class="quantity">x${valuesObj.amount}</p>
              </div>`
  );
  cartTotal += parseFloat(valuesObj.price) * parseFloat(valuesObj.amount);
  // cartItemNumber += parseFloat(valuesObj.amount);
}
total.setAttribute("data-total", cartTotal);
// console.log(cartTotal);
total.textContent = `${parseFloat(cartTotal.toFixed(0)).toLocaleString(
  "en-US",
  priceOptions
)}`;

vat.setAttribute("data-vat", cartTotal * (VAT - 1));
vat.textContent = `${parseFloat(
  (cartTotal * (VAT - 1)).toFixed(0)
).toLocaleString("en-US", priceOptions)}`;

grandTotal.setAttribute(
  "data-grand-total",
  cartTotal * VAT + parseInt(shipping.dataset.shipping)
);
grandTotal.textContent = `${parseFloat(
  (cartTotal * VAT + parseInt(shipping.dataset.shipping)).toFixed(0)
).toLocaleString("en-US", priceOptions)}`;

// console.log(localStorage.getItem("cart"));
orderConfirmationDialogBtn.addEventListener(
  "click",
  showOrderConfirmationDialog
);
main.addEventListener("click", (e) => {});
const eMoneyNumber = document.querySelector("#e-money-number");
main.addEventListener("input", (e) => {
  //   console.log(e.target, "here");
  //   console.log("djfalkd");
  const input = e.target.closest("input");
  if (input) {
    if (input.getAttribute("type") !== "radio") {
      const spanError =
        input.previousElementSibling.querySelector("[data-error]");
      spanError.classList.toggle("error", !input.validity.valid);
      spanError.classList.toggle("hide", input.validity.valid);
      //   console.log(input.validity);
    } else if (input.getAttribute("type") == "radio") {
      const eMoneyNumber = document.querySelector("#e-money-number");
      const eMoneyPin = document.querySelector("#e-money-pin");

      if (input.getAttribute("id") == "e-money") {
        eMoneyNumber.setAttribute("required", true);
        eMoneyPin.setAttribute("required", true);
      } else {
        eMoneyNumber.removeAttribute("required");
        eMoneyPin.removeAttribute("required");
      }
      //   console.log(input);
    }
    // console.log(eMoneyNumber.validity);
  }
});
