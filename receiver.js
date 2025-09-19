trMIDI.addEventListener('newMessage', (e) => {
  const data = e.detail;
  const bankChange = data[0] === 0xb0;
  const programChange = data[0] === 0xc0;
  const modeReplay = data[4] === 0x42;
  const modeChangedOnDevice = data[4] === 0x4e;
  const progDataReplay = data[4] === 0x40;
  const combiDataReplay = data[4] === 0x49;
  const postProccess = data[4] === 0x6e;

  if (bankChange) {
    tritonRemoteUpdater.onBankChanged(data);
    trMIDI.dispatchEvent(new CustomEvent('remoteStateUpdated'));
  } else if (programChange) {
    console.log('Program change');
    console.log(data);
  } else if (modeReplay) {
    tritonRemoteUpdater.onModeReqReplay(data);
    trMIDI.dispatchEvent(new CustomEvent('remoteStateUpdated'));
  } else if (modeChangedOnDevice) {
    tritonRemoteUpdater.onModeChanged(data);
    trMIDI.dispatchEvent(new CustomEvent('remoteStateUpdated'));
  } else if (progDataReplay) {
    console.log('Program Data Replay');
    console.log(data);
  } else if (combiDataReplay) {
    console.log('Combi data replay');
    console.log(data);
  } else if (postProccess) {
    console.log('Post proccess');
    console.log(data);
  } else {
    console.log('Unkown Message');
    console.log(data);
  }
});
