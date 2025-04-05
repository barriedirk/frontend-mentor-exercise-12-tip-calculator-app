export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export function removeClassFromNodeList(elemList, className) {
  elemList.forEach((elem) => {
    elem.classList.remove(className);
  });
}

export function onlyNumberOrPercent(event) {
  let value = event.target.value;
  const isPercent = event.target.getAttribute("data-ispercent") === "true";

  const decimals = parseInt(event.target.getAttribute("data-decimal"), 10);
  const regExp = decimals === 0 ? /[^0-9]/g : /[^0-9.]/g;

  // Remove unwanted characters (non-numeric and non-decimal point)
  value = value.replace(regExp, "");

  // Split the value into two parts: before and after the decimal point
  const parts = value.split(".");

  // Handle leading zeros and invalid formatting
  if (parts[0]) {
    // Remove leading zeros from the integer part, but keep a single '0' if it's just '0'
    parts[0] = parts[0].replace(/^0+(?!$)/, "");
    if (parts[0] === "") {
      parts[0] = "0"; // Ensure the value is at least "0" if no number is provided
    }
  }

  // If the decimal part is longer than the allowed decimal places, slice it
  if (parts[1] && parts[1].length > decimals) {
    parts[1] = parts[1].slice(0, decimals);
  }

  // Join the integer and decimal parts back together
  value = parts.join(".");

  if (isPercent) {
    if (parseFloat(value) > 100) {
      event.target.value = 100;
    }
  } else {
    // Set the final value back to the input
    event.target.value = value;
  }
}

export function onFocus(event) {
  event.target.select();
}

export function onBlur(event) {
  const errorMessage = event.target.getAttribute("data-error-message");
  const errorSpan = event.target.nextElementSibling;
  const parent = event.target.parentElement;
  const value = parseInt(event.target.value || "0", 10);

  if (value === 0) {
    parent.classList.add("form-group-error");
    errorSpan.textContent = errorMessage;
  } else {
    parent.classList.remove("form-group-error");
    errorSpan.textContent = "";
  }
}
