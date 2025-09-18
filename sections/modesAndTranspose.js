const changeModeButtons = document.querySelectorAll(
  '[ldata-id="change-mode-btn"]'
);
const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

let currentTransposeValue = +transposeValue.textContent;
