import {
  onlyNumberOrPercent,
  onFocus,
  onBlur,
  removeClassFromNodeList,
  $,
  $$,
} from "./utils.js";

let state = {
  bill: 0,
  numberPeople: 0,
  tip: 0,
  customTip: 0,
};

const $billInput = $("#bill");
const $numberPeopleInput = $("#number-people");
const $tipInput = $("#custom-tip");

const $tipButtons = $$(".tip-calculator__tips button");
const $customTipWrapper = $(".form-group-custom-tip");

const $resultTipAmount = $("#result-tip-amount");
const $resultTipTotal = $("#result-tip-total");

const $btnReset = $("#tip-calculator-button-reset");

const valueMap = {
  bill: "bill",
  "custom-tip": "customTip",
  "number-people": "numberPeople",
};

const clearTimeoutMap = {};

const resetState = () => {
  state = {
    bill: 0,
    numberPeople: 0,
    tip: 0,
    customTip: 0,
  };

  removeClassFromNodeList($tipButtons, "selected");
  $customTipWrapper.classList.add("hidden");

  $btnReset.disabled = true;
  $resultTipAmount.textContent = "$0.00";
  $resultTipTotal.textContent = "$0.00";
  $billInput.value = 0;
  $tipInput.value = 0;
  $numberPeopleInput.value = 0;

  $billInput.focus();
};

const updateTotales = (state) => {
  console.log("updateTotales", { state });

  if (
    state.bill === 0 ||
    state.numberPeople === 0 ||
    (state.tip == 0 && state.customTip == 0)
  ) {
    $resultTipAmount.textContent = "$0.00";
    $resultTipTotal.textContent = "$0.00";

    $btnReset.disabled = true;

    return;
  }

  const isCustomTip = state.customTip !== 0;
  const tipAmountTotal = isCustomTip
    ? state.customTip
    : state.bill * (state.tip / 100);
  const tipAmountPerPerson = tipAmountTotal / state.numberPeople;
  const total = state.bill + tipAmountTotal;
  const totalPerPerson = total / state.numberPeople;

  $resultTipAmount.textContent = `$${tipAmountPerPerson.toFixed(2)}`;
  $resultTipTotal.textContent = `$${totalPerPerson.toFixed(2)}`;
  $btnReset.disabled = false;
};

const updateState = (state, property, value) => {
  state[property] = value;

  updateTotales(state);
};

[$tipInput, $billInput, $numberPeopleInput].forEach((input) => {
  input.addEventListener("input", onlyNumberOrPercent);
  input.addEventListener("focus", onFocus);
  input.addEventListener("blur", onBlur);
  input.addEventListener("input", function (event) {
    const name = event.target.name;
    const property = valueMap[name];
    const value = parseFloat(event.target.value || "0");

    if (clearTimeoutMap[name]) clearTimeout(clearTimeoutMap[name]);

    clearTimeoutMap[name] = setTimeout(() => {
      updateState(state, property, value);
    }, 700);
  });
});

$tipButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const tipValue = event.target.getAttribute("data-tip");

    removeClassFromNodeList($tipButtons, "selected");

    if (tipValue === "custom") {
      $customTipWrapper.classList.remove("hidden");
      $tipInput.focus();
      updateState(state, "tip", 0);
    } else {
      updateState(state, "tip", parseInt(tipValue, 10));
      updateState(state, "customTip", 0);

      $customTipWrapper.classList.add("hidden");
      $tipInput.value = tipValue;
    }

    event.target.classList.add("selected");
  });
});

$btnReset.addEventListener("click", resetState);

resetState();
