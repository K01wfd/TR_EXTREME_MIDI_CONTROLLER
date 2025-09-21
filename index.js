const outputMode = document.getElementById('output-mode');
const outputBank = document.getElementById('output-bank');
const outputPatchName = document.getElementById('output-patch-name');

const onReady = (_) => {
  sender.triton.requestMode();
  sender.triton.requestPatchDeatils();
};

// Banks Handler
const banksHandler = (_) => {
  const tritonState = state.triton;
  updateBanks(tritonState);
};

// Modes Handler
const modesHandler = (_) => {
  const tritonState = state.triton;
  updateBanksSection(tritonState);
  updateBanks(tritonState);
};

// Patch name handler
const patchNameHandler = (_) => {
  const tritonState = state.triton;
  updatePatchName(tritonState);
};

// User scale buttons handler
const globalDataHandler = (_) => {
  const { tuning } = parseGlobalDump(modifiedGlobal);
  userScaleButtons.forEach((btn) => {
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;

    const firstPortion = tuning.slice(0, 8);
    const secondPortion = tuning.slice(8);
    const firstPortionNoFlag = firstPortion.slice(1, 8);
    const secondPortionNoFlag = secondPortion.slice(1);

    TRITON_CHANGE_MESSAGES.tunning1 = decode8to7bit(firstPortion);
    TRITON_CHANGE_MESSAGES.tunning2 = decode8to7bit(secondPortion);
    TRITON_CHANGE_MESSAGES.readyTunning1 = encode7bitTo8(TRITON_CHANGE_MESSAGES.tunning1);
    TRITON_CHANGE_MESSAGES.readyTunning2 = encode7bitTo8(TRITON_CHANGE_MESSAGES.tunning2);

    if (btnPortion === 1) {
      if (firstPortionNoFlag[btnIndex] > 0) {
        btn.classList.add('btn-active');
      }
    }
    if (btnPortion === 2) {
      if (secondPortionNoFlag[btnIndex] > 0) {
        btn.classList.add('btn-active');
      }
    }
  });
};

// Banks Section Updater
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

// Mode Section Updater
function updateModeSection(state) {
  changeModeButtons.forEach((btn) => {
    btn.classList.remove('btn-active');
    if (btn.value === state.modeText) {
      btn.classList.add('btn-active');
    }
  });
}

// Banks Buttons Updater
function updateBanks(state) {
  const buttons = state.modeText === 'program' ? progBanksButtons : combiBanksButtons;
  buttons.forEach((btn) => btn.classList.remove('btn-active'));
  buttons.forEach((btn) => {
    const label = btn.dataset.label;
    if (label === state.currentBank.label) {
      btn.classList.add('btn-active');
    }
  });
}

// Patch Name Updater
function updatePatchName(state) {
  let patchName = state.patchName ? state.patchName : 'Initial';
  let patchNumber = state.patchNumber < 10 ? '0' + state.patchNumber : state.patchNumber;
  let currentBank = state.currentBank.label;
  patchName = currentBank + patchNumber + ': ' + patchName;
  outputPatchName.textContent = patchName;
}

// Listeners
trMIDI.addEventListener('RBankChangedOnKeyboard', banksHandler);
trMIDI.addEventListener('RModeChangedOnDevice', modesHandler);

trMIDI.addEventListener('ready', onReady);
trMIDI.addEventListener('modeDataRecieved', modesHandler);
trMIDI.addEventListener('localModesUpdated', modesHandler);
trMIDI.addEventListener('programDataReceived', patchNameHandler);
trMIDI.addEventListener('combiDataReceived', patchNameHandler);
trMIDI.addEventListener('globalDataReceived', globalDataHandler);

// Toggle between userscale buttons and other sections
let sectionState = 'pads';
const toggler = document.getElementById('toggler');
toggler.addEventListener('click', (_) => {
  if (sectionState === 'pads') {
    programChangePadsContainer.style.display = 'none';
    progBanksContainer.style.display = 'none';
    combiBanksContainer.style.display = 'none';
    userScaleContainer.style.display = 'flex';
    sectionState = 'userscale';
    toggler.textContent = 'Pads';
  } else {
    programChangePadsContainer.style.display = 'flex';
    state.triton.modeNumber === 0
      ? (combiBanksContainer.style.display = 'flex')
      : (progBanksContainer.style.display = 'flex');

    userScaleContainer.style.display = 'none';
    sectionState = 'pads';
    toggler.textContent = 'User Scale';
  }
});

document.addEventListener(
  'dblclick',
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);
