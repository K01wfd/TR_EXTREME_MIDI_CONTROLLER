const programChangePadsContainer = document.querySelector('.prog-change-container');
const padsButtons = document.querySelectorAll('[data-id="patch-number-btn-pad"]');
const tempPatchNumber = document.querySelector('.temp-patch-number');

let clickedNumber = '';
let numOfClicks = 0;

padsButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    clickedNumber += btn.value;

    btn.classList.add('btn-active');
    tempPatchNumber.style.display = 'block';
    tempPatchNumber.textContent = clickedNumber;

    clickedNumber = +clickedNumber;
    numOfClicks++;

    if (clickedNumber > 127) {
      resetPads();
    }

    if (numOfClicks === 2 && clickedNumber > 19) {
      sender.triton.changePatch(clickedNumber);
      setTimeout(() => sender.triton.requestPatchDeatils(), 50);
      tritonLocalUpdater.updatePatchNumber(clickedNumber);
      resetPads();
      trMIDI.dispatchEvent(new CustomEvent('localStateUpdated'));
    }

    if (numOfClicks === 3) {
      sender.triton.changePatch(clickedNumber);
      setTimeout(() => sender.triton.requestPatchDeatils(), 50);
      tritonLocalUpdater.updatePatchNumber(clickedNumber);
      resetPads();
      trMIDI.dispatchEvent(new CustomEvent('localStateUpdated'));
    }
  });
});

function resetPads() {
  padsButtons.forEach((btn) => btn.classList.remove('btn-active'));
  tempPatchNumber.style.display = 'none';
  clickedNumber = '';
  numOfClicks = 0;
  return;
}
