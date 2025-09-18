const outputMode = document.getElementById('output-mode');
const outputBank = document.getElementById('output-bank');
const outputPatchName = document.getElementById('output-patch-name');

trMIDI.addEventListener('stateUpdated', (e) => {
  const state = e.detail;
  console.log(state);
  // update the ui here
});
