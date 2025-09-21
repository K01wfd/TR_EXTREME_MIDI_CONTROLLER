const sender = {
  triton: {
    changeMode: function (modeText) {
      trMIDI.sendMessage(changeModeMessage(modeText));
    },
    requestMode: function () {
      const msg = TRITON_REQUEST_MESSAGES['modeRequest'];
      trMIDI.sendMessage(msg);
    },
    changeBank: function (bankLabel, channel = 0) {
      const map = TRITON_BANKS_MESSAGES[state.triton.modeNumber];
      const b = map[bankLabel];
      // Send CC0 (MSB)
      trMIDI.sendMessage([0xb0 | channel, 0x00, b.msb]);
      // Send CC32 (LSB)
      trMIDI.sendMessage([0xb0 | channel, 0x20, b.lsb]);

      trMIDI.sendMessage([0xc0 | channel, state.triton.patchNumber]);
    },
    changePatch: function (patchNumber, channel = 0) {
      trMIDI.sendMessage([0xc0 | channel, patchNumber]);
    },
    requestPatchDeatils: function () {
      if (state.triton.modeText === 'program') {
        const msg = TRITON_REQUEST_MESSAGES['progRequest'];
        trMIDI.sendMessage(msg);
      } else if (state.triton.modeText === 'combination') {
        const msg = TRITON_REQUEST_MESSAGES['combiRequest'];
        trMIDI.sendMessage(msg);
      }
    },
    requestGlobalDump: function () {
      const msg = TRITON_REQUEST_MESSAGES['globalRequest'];
      trMIDI.sendMessage(msg);
    },
    sendScaleTunning: function (index, value, portionNum) {
      const dumpHeader = modifiedGlobal.slice(0, 14);
      if (portionNum === 1) {
        TRITON_CHANGE_MESSAGES.tunning1[index] = value;
        TRITON_CHANGE_MESSAGES.readyTunning1 = encode7bitTo8(TRITON_CHANGE_MESSAGES.tunning1);
      } else {
        TRITON_CHANGE_MESSAGES.tunning2[index] = value;
        TRITON_CHANGE_MESSAGES.readyTunning2 = encode7bitTo8(TRITON_CHANGE_MESSAGES.tunning2);
      }

      const tunningBody = [...TRITON_CHANGE_MESSAGES.readyTunning1, ...TRITON_CHANGE_MESSAGES.readyTunning2];
      const dumpTail = modifiedGlobal.slice(30);
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      modifiedGlobal = combined;
      trMIDI.sendMessage(combined);
    },
    resetGlobal: function () {
      trMIDI.sendMessage(defaultGlobal);
    },
  },
};

const [insertIndex, msg] = TRITON_CHANGE_MESSAGES.modeChange();

function changeModeMessage(modeText) {
  const modeValue = TRITON_MODES_TO_NUMBERS[modeText];
  msg[insertIndex] = modeValue;
  return msg;
}
