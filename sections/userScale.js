const userScaleContainer = document.querySelector('.userScale');
const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const tunningRange = document.getElementById('tunning-range');
const tunningRangeValue = document.getElementById('tunning-range-value');
const globalReset = document.getElementById('reset-global');

let tunningValue = +tunningRangeValue.textContent;
tunningRange.addEventListener('input', (e) => {
  const range = parseInt(e.target.value);
  tunningValue = range;
  tunningRangeValue.textContent = range;
});

userScaleButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    btn.classList.toggle('btn-active');
    if (!btn.classList.contains('btn-active')) {
      btn.value = 0;
    } else {
      btn.value = tunningValue;
    }
    const btnValue = +btn.value;
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;

    sender.triton.sendScaleTunning(btnIndex, btnValue, btnPortion);
  });
});

globalReset.addEventListener('click', (_) => {
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  Object.assign(TRITON_CHANGE_MESSAGES, TRITON_CHANGE_MESSAGES_DEFAULT);
  sender.triton.resetGlobal();
});
