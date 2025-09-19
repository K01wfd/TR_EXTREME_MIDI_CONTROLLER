const progBanksContainer = document.querySelector('.prog-banks');
const combiBanksContainer = document.querySelector('.combi-banks');

const progBanksButtons = document.querySelectorAll('[data-id="program-bank-btn"]');
const combiBanksButtons = document.querySelectorAll('[data-id="combination-bank-btn"]');

const banksButtons = [...combiBanksButtons, ...progBanksButtons];

banksButtons.forEach((btn) => {
  if (btn.dataset.label === state.triton.currentBank.label) {
    btn.classList.add('btn-active');
  }
  btn.addEventListener('click', (_) => {
    const label = btn.dataset.label;
    const index = +btn.dataset.index;

    sender.triton.changeBank(label);
    tritonLocalUpdater.updateBankLabel(index);

    banksButtons.forEach((btn) => btn.classList.remove('btn-active'));
    if (label === state.triton.currentBank.label) {
      btn.classList.add('btn-active');
    }
    trMIDI.dispatchEvent(new CustomEvent('localStateUpdated'));
  });
});

// combiBanksButtons.forEach((btn) => {
//   btn.addEventListener('click', (_) => {
//     const label = btn.dataset.label;
//     const index = +btn.dataset.index;

//     sender.triton.changeBank(label);
//     tritonLocalUpdater.updateBankLabel(index);
//     trMIDI.dispatchEvent(new CustomEvent('localStateUpdated'));
//   });
// });
