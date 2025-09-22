const outputMode = document.getElementById('output-mode');
const outputBank = document.getElementById('output-bank');
const outputPatchName = document.getElementById('output-patch-name');
const controlls = document.querySelector('.controlls');
const onReady = (_) => {
  sender.triton.requestGlobalDump();
  setTimeout(() => {
    sender.triton.requestMode();
    sender.triton.requestPatchDeatils();
  }, 100);
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
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => {
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;

    const firstPortion = tuning.slice(0, 8);
    const secondPortion = tuning.slice(8);
    const firstPortionNoFlag = firstPortion.slice(1, 8);
    const secondPortionNoFlag = secondPortion.slice(1);

    TRITON_TUNNING_PORTIONS.temp1 = decode8to7bit(firstPortion);
    TRITON_TUNNING_PORTIONS.temp2 = decode8to7bit(secondPortion);
    TRITON_TUNNING_PORTIONS.ready1 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp1);
    TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);

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

const presetUpdateHandler = (_) => {
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => {
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;
    const firstPortion = TRITON_TUNNING_PORTIONS.temp1.slice(0);
    const secondPortion = TRITON_TUNNING_PORTIONS.temp2.slice(0);

    if (btnPortion === 1) {
      if (firstPortion[btnIndex] !== 0) {
        btn.classList.add('btn-active');
      }
    }
    if (btnPortion === 2) {
      if (secondPortion[btnIndex] !== 0) {
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

// Toggle between userscale buttons and other sections
let sectionState = 'userscale';
const toggler = document.getElementById('toggler');
toggler.addEventListener('click', (_) => {
  if (sectionState === 'controlls') {
    controlls.style.display = 'none';
    userScaleContainer.style.display = 'flex';
    sectionState = 'userscale';
    toggler.textContent = 'Controlls';
  } else {
    controlls.style.display = 'block';
    userScaleContainer.style.display = 'none';
    sectionState = 'controlls';
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

// Listeners
trMIDI.addEventListener('localModesUpdated', modesHandler);
trMIDI.addEventListener('presetsUpdated', presetUpdateHandler);

trMIDI.addEventListener('RBankChangedOnKeyboard', banksHandler);
trMIDI.addEventListener('RModeChangedOnDevice', modesHandler);

trMIDI.addEventListener('ready', onReady);
trMIDI.addEventListener('modeDataRecieved', modesHandler);
trMIDI.addEventListener('programDataReceived', patchNameHandler);
trMIDI.addEventListener('combiDataReceived', patchNameHandler);
trMIDI.addEventListener('globalDataReceived', globalDataHandler);
