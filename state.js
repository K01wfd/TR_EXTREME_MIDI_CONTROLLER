const state = {
  triton: {
    modeText: 'combination',
    modeNumber: 0,
    currentBank: { number: 0, label: 'A' },
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
};
