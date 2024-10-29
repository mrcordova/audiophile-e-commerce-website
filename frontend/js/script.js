const link = document.querySelector("[data-menu-item]");

const main = document.querySelector("main");
const cartDialog = document.querySelector("#cartDialog");
const header = document.querySelector("header");
const VAT = 1.2;
const priceOptions = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

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
  n = Math.max(min, n);
  return n;
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
  return newVal;
}
// function showDialog(e) {
//   const cartDialog = document.getElementById("cartDialog");
//   cartDialog.showModal();
// }
// function showOrderConfirmationDialog(e) {
//   const orderConfirmationDialog = document.querySelector(
//     "#orderConfirmationDialog"
//   );
//   orderConfirmationDialog.showModal();
// }
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
// console.log(productBtns);
// for (const productBtn of productBtns) {
//   productBtn.addEventListener("click", goToPage);
// }

// for (const returnBtn of returnBtns) {
//   returnBtn.addEventListener("click", returnToPage);
// }
// orderConfirmationDialogBtn.addEventListener(
//   "click",
//   showOrderConfirmationDialog
// );

// for (const showBtn of showBtns) {
//   showBtn.addEventListener("click", showDialog);
// }
cartDialog.addEventListener("click", (e) => {
  const counterBtn = e.target.closest("button[data-counter-amount]");
  const removeAllBtn = e.target.closest("button[data-cart-remove-all]");
  // e.preventDefault();
  // console.log(e.target.tagName);d
  if (counterBtn) {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartTotal = cartDialog.querySelector("[data-cart-total]");
    const cartNumber = cartDialog.querySelector("[data-cart-number");
    const priceEle = counterBtn.parentElement.querySelector("[data-price]");
    const itemTotal = parseFloat(
      parseFloat(priceEle.dataset.price) *
        parseInt(counterBtn.dataset.counterAmount) *
        VAT
    );
    const cartTotalVal = parseFloat(cartTotal.dataset.cartTotal);
    const itemName = priceEle.parentElement.parentElement.dataset.name;

    // console.log(priceEle.parentElement.parentElement);
    let cartItemIdx;
    const result = Object.entries(cart).find((val, idx) => {
      cartItemIdx = idx;
      return val[0] == itemName;
    });
    // console.log(cartItemIdx);
    result[1].amount = updateCounter(counterBtn, 0);

    const newCartNumber =
      parseInt(cartNumber.dataset.cartNumber) +
      parseInt(counterBtn.dataset.counterAmount);

    cartNumber.setAttribute("data-cart-number", newCartNumber);
    cartNumber.textContent = `(${newCartNumber})`;

    // console.log(itemTotal.toFixed(0));
    const newTotal = Math.max(
      parseFloat(cartTotalVal) + parseFloat(itemTotal),
      0
    );

    // console.log(newTotal.toFixed(0));
    cartTotal.setAttribute("data-cart-total", newTotal);
    cartTotal.textContent = `${parseFloat(newTotal.toFixed(0)).toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;

    // console.log(cart);

    localStorage.setItem("cart", JSON.stringify(cart));
    if (priceEle.dataset.counterValue == "0") {
      const { [itemName]: _, ...newCart } = cart;
      // console.log(priceEle.parentElement.parentElement.children[0]);
      localStorage.setItem("cart", JSON.stringify(newCart));
      priceEle.parentElement.parentElement.remove();
    }

    // console.log(cartTotal);
  } else if (removeAllBtn) {
    const cartTotal = cartDialog.querySelector("[data-cart-total]");
    const cartNumber = cartDialog.querySelector("[data-cart-number");
    const cartItems = cartDialog.querySelector(".cart-items");
    cartNumber.setAttribute("data-cart-number", 0);
    cartNumber.textContent = `(0)`;

    cartTotal.setAttribute("data-cart-total", 0);
    cartTotal.textContent = `$ 0`;

    cartItems.replaceChildren();
    localStorage.setItem("cart", JSON.stringify({}));
  }
});
main.addEventListener("click", (e) => {
  const counterBtn = e.target.closest("button[data-counter-amount]");
  const addCartBtn = e.target.closest("button[data-product-cart]");
  const returnBtn = e.target.closest("button[data-return]");

  if (counterBtn) {
    const _ = updateCounter(counterBtn);
  } else if (addCartBtn) {
    const counterVal = addCartBtn.previousElementSibling.querySelector(
      "span[data-counter-value]"
    ).dataset.counterValue;
    const cart = JSON.parse(localStorage.getItem("cart"));
    // console.log(addCartBtn.dataset.img);
    cart[addCartBtn.dataset.productCart] = {
      amount: counterVal,
      price: addCartBtn.dataset.price,
      image: addCartBtn.dataset.img,
    };

    localStorage.setItem("cart", JSON.stringify(cart));
  } else if (returnBtn) {
    returnToPage(e);
  }
});

header.addEventListener("click", (e) => {
  // console.log(e.target);
  const cartDialogBtn = e.target.closest("button[data-show-dialog]");
  if (cartDialogBtn) {
    const cartDialogItemsCont = document.querySelector(
      "#cartDialog .cart-items"
    );
    const cartNumberEle = document.querySelector(
      "#cartDialog span[data-cart-number]"
    );
    const cartTotalEle = document.querySelector(
      " #cartDialog [data-cart-total]"
    );
    // console.log(cartNumberEle);
    const cart = JSON.parse(localStorage.getItem("cart"));
    let cartTotal = 0;
    let cartItemNumber = 0;
    cartDialogItemsCont.replaceChildren();
    // console.log(Object.entries(cart));
    for (const [name, valuesObj] of Object.entries(cart)) {
      const price = parseInt(valuesObj.price).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      });
      cartDialogItemsCont.insertAdjacentHTML(
        "beforeend",
        ` <div class="cart-item-cont" data-name="${name}">
            <img
              src="${valuesObj.image}"
              alt="${name}" />
            <div class="cart-item-info manrope-bold">
              <p class="title">${name}</p>
              <p class="amount">${price}</p>
            </div>
            <div class="counter">
              <button data-counter-amount="-1" class="product-btn manrope-bold">
                -
              </button>
              <span
                data-price="${valuesObj.price}"
                data-counter-value="${valuesObj.amount}"
                class="manrope-bold">
                ${valuesObj.amount}
              </span>
              <button data-counter-amount="1" class="product-btn manrope-bold">
                +
              </button>
            </div>
          </div>`
      );
      cartTotal += parseFloat(valuesObj.price) * parseFloat(valuesObj.amount);
      cartItemNumber += parseFloat(valuesObj.amount);
    }

    const newTotal = parseFloat(cartTotal) * VAT;
    cartTotalEle.setAttribute("data-cart-total", newTotal);
    cartTotalEle.textContent = `${parseFloat(
      newTotal.toFixed(0)
    ).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
    cartNumberEle.setAttribute("data-cart-number", cartItemNumber);
    cartNumberEle.textContent = `(${cartItemNumber})`;
  }
});

export { VAT, priceOptions };
