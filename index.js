const outputMode = document.getElementById('output-mode');
const outputBank = document.getElementById('output-bank');
const outputPatchName = document.getElementById('output-patch-name');

const onReady = (_) => {
  sender.triton.requestMode();
};

const onRemoteStateUpdated = (_) => {
  const tritonState = state.triton;
  updateModeSection(tritonState);
  updateBanksSection(tritonState);
  updateBanks(tritonState);
};

const onLocalStateUpdated = (_) => {
  const tritonState = state.triton;
  updateBanksSection(tritonState); // when modes changes update
  updateBanks(tritonState);
};

function updateBanksSection(state) {
  if (state.modeNumber === 0) {
    progBanksContainer.style.display = 'none';
    combiBanksContainer.style.display = 'flex';
  }
  if (state.modeNumber === 2) {
    progBanksContainer.style.display = 'flex';
    combiBanksContainer.style.display = 'none';
  }
}
function updateBanks(state) {
  banksButtons.forEach((btn) => {
    const label = btn.dataset.label;
    if (label === state.currentBank.label) {
      btn.classList.add('btn-active');
    }
  });
}

trMIDI.addEventListener('ready', onReady);
trMIDI.addEventListener('remoteStateUpdated', onRemoteStateUpdated);
trMIDI.addEventListener('localStateUpdated', onLocalStateUpdated);
