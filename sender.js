const sender = {
  triton: {
    changeMode: function (modeText) {
      trMIDI.sendMessage(changeModeMessage(modeText));
    },
    requestMode: function () {
      const msg = TRITON_REQUEST_MESSAGES['modeRequest'];
      trMIDI.sendMessage(msg);
    },
    changeBank(bankLabel, channel = 0) {
      const map = TRITON_BANKS_MESSAGES[state.triton.modeNumber];
      const b = map[bankLabel];

      // Send CC0 (MSB)
      trMIDI.sendMessage([0xb0 | channel, 0x00, b.msb]);
      // Send CC32 (LSB)
      trMIDI.sendMessage([0xb0 | channel, 0x20, b.lsb]);

      trMIDI.sendMessage([0xc0 | channel, 0]);
    },
  },
};

const [insertIndex, msg] = TRITON_CHANGE_MESSAGES.modeChange();

function changeModeMessage(modeText) {
  const modeValue = TRITON_MODES_TO_NUMBERS[modeText];
  msg[insertIndex] = modeValue;
  return msg;
}
