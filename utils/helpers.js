function toHex7bit(value) {
  // Wrap into 7-bit range (0–127)
  const byte = (value + 128) % 128;
  return byte.toString(16).toUpperCase().padStart(2, '0x');
}

function genRandomColor() {
  let minL = 30;
  let maxL = 60;
  let minS = 30; // avoid grayish colors
  let maxS = 100;

  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * (maxS - minS + 1)) + minS;
  const luminance = Math.floor(Math.random() * (maxL - minL + 1)) + minL;

  return `hsl(${hue}, ${saturation}%, ${luminance}%)`;
}

function extractPatchName(data) {
  let text = '';

  const symbols = Array.from({ length: 32 }, (_, i) => String.fromCharCode(i + 32));

  const upperCase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
  const lowerCase = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97));
  const combined = [...upperCase, ...lowerCase, ...symbols];

  const extracted = data.slice(7, 24);

  extracted.forEach((code) => {
    const str = String.fromCharCode(code);
    if (combined.indexOf(str) !== -1) {
      text += String.fromCharCode(code);
    }
  });
  return text;
}

function extractMode(modeNumber) {
  return TRITON_NUMBER_TO_MODES[modeNumber];
}

function extractBankName(data) {
  if (data[1] === 32) {
    return BANKS_NUMBERS_TO_LABEL[data[2]];
  }
}

function updateModeSection(state) {
  changeModeButtons.forEach((btn) => {
    btn.classList.remove('btn-active');
    if (btn.value === state.modeText) {
      btn.classList.add('btn-active');
    }
  });
}
