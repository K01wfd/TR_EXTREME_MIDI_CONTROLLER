const state = {
  triton: {
    modeText: 'combination',
    modeNumber: 0,
    currentBank: { number: 0, label: 'A' },
    patchNumber: 0,
    patchName: 'Initial',
  },
};

const tritonLocalUpdater = {
  updateModeText: (modeNumber) => {
    const { triton } = state;
    triton.modeText = TRITON_NUMBER_TO_MODES[modeNumber];
    triton.modeNumber = TRITON_MODES_TO_NUMBERS[triton.modeText];
  },
  updateModeNumber: (modeText) => {
    const { triton } = state;
    triton.modeNumber = TRITON_MODES_TO_NUMBERS[modeText];
    triton.modeText = TRITON_NUMBER_TO_MODES[triton.modeNumber];
  },
  updateBankLabel: (bankNumber) => {
    const { triton } = state;
    triton.currentBank.label = TRITON_BANKS_NUMBERS_TO_LABEL[bankNumber];
    triton.currentBank.number = TRITON_BANKS_LABELS_TO_NUMBERS[triton.currentBank.label];
  },
  updateBankNumber: (bankLabel) => {
    const { triton } = state;
    triton.currentBank.number = TRITON_BANKS_LABELS_TO_NUMBERS[bankLabel];
    triton.currentBank.label = TRITON_BANKS_NUMBERS_TO_LABEL[triton.currentBank.number];
  },
  updatePatchNumber: (patchNumber) => {
    const { triton } = state;
    triton.patchNumber = patchNumber;
  },
  upadtePatchName: (patchName) => {
    const { triton } = state;
    triton.patchName = patchName;
  },
};

const tritonRemoteUpdater = {
  onModeChanged: (data) => {
    const modeNumber = data[5];
    tritonLocalUpdater.updateModeText(modeNumber);
  },
  onModeReqReplay: (data) => {
    const modeNumber = data[5];
    tritonLocalUpdater.updateModeText(modeNumber);
  },
  onBankChanged: (data) => {
    if (data[0] === 176 && data[1] === 32) {
      tritonLocalUpdater.updateBankLabel(data[2]);
    }
  },
  onProgDataReplay: (data) => {
    const patchName = extractPatchName(data);
    tritonLocalUpdater.upadtePatchName(patchName);
  },
  onCombiDataReplay: (data) => {
    const patchName = extractPatchName(data);
    tritonLocalUpdater.upadtePatchName(patchName);
  },
  onGlobalDumpReplay: (data) => {
    modifiedGlobal = data;
  },
};
