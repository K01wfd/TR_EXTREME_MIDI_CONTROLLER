trMIDI.addEventListener('newMessage', (e) => {
  const data = e.detail;
  const bankChange = data[0] === 0xb0;
  const programChange = data[0] === 0xc0;
  const modeReplay = data[4] === 0x42;
  const modeChangedOnDevice = data[4] === 0x4e;
  const progDataReplay = data[4] === 0x40;
  const combiDataReplay = data[4] === 0x49;
  const postProccess = data[4] === 0x6e;
  const globalDumpReplay = data[4] === 0x51;

  if (bankChange) {
    tritonRemoteUpdater.onBankChanged(data);
    trMIDI.dispatchEvent(new CustomEvent('RBankChangedOnKeyboard'));
  } else if (programChange) {
    console.log('Program change');
    console.log(data);
  } else if (modeReplay) {
    tritonRemoteUpdater.onModeReqReplay(data);
    trMIDI.dispatchEvent(new CustomEvent('modeDataRecieved'));
  } else if (modeChangedOnDevice) {
    tritonRemoteUpdater.onModeChanged(data);
    trMIDI.dispatchEvent(new CustomEvent('RModeChangedOnDevice'));
  } else if (progDataReplay) {
    tritonRemoteUpdater.onProgDataReplay(data);
    trMIDI.dispatchEvent(new CustomEvent('programDataReceived'));
  } else if (combiDataReplay) {
    tritonRemoteUpdater.onCombiDataReplay(data);
    trMIDI.dispatchEvent(new CustomEvent('combiDataReceived'));
  } else if (postProccess) {
  } else if (globalDumpReplay) {
    tritonRemoteUpdater.onGlobalDumpReplay(data);
    trMIDI.dispatchEvent(new CustomEvent('globalDataReceived'));
  } else {
    console.log('Unkown Message');
    console.log(data);
  }
});
