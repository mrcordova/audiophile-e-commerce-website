import { VAT, priceOptions } from "./script.js";

// console.log(VAT);
if (!("cart" in localStorage)) {
  localStorage.setItem("cart", JSON.stringify({}));
}
const cart = JSON.parse(localStorage.getItem("cart"));
let cartTotal = 0;
// let cartItemNumber = 0;
const cartItems = document.querySelector(".checkout-summary .cart-items");
const total = document.querySelector(".checkout-summary [data-total]");
const vat = document.querySelector(".checkout-summary [data-vat]");
const shipping = document.querySelector(".checkout-summary [data-shipping]");
const grandTotal = document.querySelector(
  ".checkout-summary [data-grand-total]"
);

cartItems.replaceChildren();
console.log(cartItems);

for (const [name, valuesObj] of Object.entries(cart)) {
  const price = parseInt(valuesObj.price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
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
console.log(cartTotal);
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
