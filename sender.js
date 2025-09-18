const sender = {
  sendModeChange: function (modeNumber) {
    trMIDI.sendMessage(changeModeMessage(modeNumber));
  },
};

function changeModeMessage(modeNumber) {
  const [insertIndex, msg] = TRITON_CHANGE_MESSAGES['modeChange'];
  msg[insertIndex] = modeNumber;
  return msg;
}
