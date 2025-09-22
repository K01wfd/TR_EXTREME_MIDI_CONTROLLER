const changeModeButtons = document.querySelectorAll('[data-id="change-mode-btn"]');
const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

let currentTransposeValue = +transposeValue.textContent;

changeModeButtons.forEach((btn) => {
  if (btn.value === state.triton.modeText) btn.classList.add('btn-active');
  btn.addEventListener('click', (_) => {
    tritonLocalUpdater.updateModeNumber(btn.value);
    changeModeButtons.forEach((btn) => btn.classList.remove('btn-active'));
    if (state.triton.modeText === btn.value) btn.classList.add('btn-active');
    sender.triton.changeMode(btn.value);
    setTimeout(() => sender.triton.changeBank(state.triton.currentBank.label), 50);
    setTimeout(() => sender.triton.requestPatchDeatils(), 100);
    trMIDI.dispatchEvent(new CustomEvent('localModesUpdated'));
  });
});

transposeButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    const btnType = btn.id === 'transpose+' ? '+' : '-';

    if (btnType === '+' && currentTransposeValue < 12) {
      currentTransposeValue++;
      transposeValue.textContent = currentTransposeValue;
      if (currentTransposeValue > 0) btn.classList.add('btn-active');
      sender.triton.sendTranspose(currentTransposeValue + 64);
      updateTranspInGlob(currentTransposeValue);
    } else if (btnType === '-' && currentTransposeValue > -12) {
      currentTransposeValue--;
      transposeValue.textContent = currentTransposeValue;
      if (currentTransposeValue < 0) btn.classList.add('btn-active');
      updateTranspInGlob(currentTransposeValue);
      sender.triton.sendTranspose(currentTransposeValue + 64);
    }

    if (currentTransposeValue === 0) transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  });
});
