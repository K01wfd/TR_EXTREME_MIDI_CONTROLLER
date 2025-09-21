const progBanksContainer = document.querySelector('.prog-banks');
const combiBanksContainer = document.querySelector('.combi-banks');

const progBanksButtons = document.querySelectorAll('[data-id="program-bank-btn"]');
const combiBanksButtons = document.querySelectorAll('[data-id="combination-bank-btn"]');

progBanksButtons.forEach((btn) => {
  if (btn.dataset.label === state.triton.currentBank.label) {
    btn.classList.add('btn-active');
  }
  btn.addEventListener('click', (_) => {
    const label = btn.dataset.label;
    const index = +btn.dataset.index;

    sender.triton.changeBank(label);
    setTimeout(() => sender.triton.requestPatchDeatils(), 100);
    tritonLocalUpdater.updateBankLabel(index);

    progBanksButtons.forEach((btn) => btn.classList.remove('btn-active'));
    if (label === state.triton.currentBank.label) {
      btn.classList.add('btn-active');
    }
  });
});
combiBanksButtons.forEach((btn) => {
  if (btn.dataset.label === state.triton.currentBank.label) {
    btn.classList.add('btn-active');
  }
  btn.addEventListener('click', (_) => {
    const label = btn.dataset.label;
    const index = +btn.dataset.index;

    sender.triton.changeBank(label);
    setTimeout(() => sender.triton.requestPatchDeatils(), 50);
    tritonLocalUpdater.updateBankLabel(index);

    combiBanksButtons.forEach((btn) => btn.classList.remove('btn-active'));
    if (label === state.triton.currentBank.label) {
      btn.classList.add('btn-active');
    }
    trMIDI.dispatchEvent(new CustomEvent('localStateUpdated'));
  });
});
