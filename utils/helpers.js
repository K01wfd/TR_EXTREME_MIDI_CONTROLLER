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

function extractPatchName(data) {
  let text = '';
  let slicedData = data.slice(7, 25);
  const uppers = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 65));
  const lowers = Array.from({ length: 26 }, (_, i) => String.fromCharCode(i + 97));
  const symbols = Array.from({ length: 32 }, (_, i) => String.fromCharCode(i + 32));
  const combined = [...uppers, ...lowers, ...symbols];

  for (let i = 0; i < slicedData.length; i++) {
    const code = slicedData[i];
    const strValue = String.fromCharCode(code);
    if (combined.indexOf(strValue) !== -1) {
      text += strValue;
    }
  }

  return text;
}

function encode7bitTo8(values) {
  if (values.length !== 7) {
    throw new Error('Block must contain exactly 7 values');
  }

  let flag = 0;
  const data = [];

  values.forEach((val, i) => {
    if (val < 0) {
      flag |= 1 << i; // set bit i for negative value
      data.push((128 + val) & 0x7f); // e.g. -1 → 127, -2 → 126
    } else {
      data.push(val & 0x7f); // positive or zero
    }
  });

  return [flag, ...data];
}
function decode8to7bit(block) {
  if (block.length !== 8) {
    throw new Error('Block must contain exactly 8 values');
  }

  const [flag, ...data] = block;
  const values = data.map((val, i) => {
    if ((flag >> i) & 1) {
      // This was negative when encoded
      return val - 128; // reverse of (128 + val) & 0x7f
    } else {
      return val;
    }
  });

  return values;
}

console.log(decode8to7bit([8, 0, 0, 0, 78, 0, 0, 0]));
function parseGlobalDump(dump) {
  if (!Array.isArray(dump)) {
    throw new Error('Dump must be an array of numbers');
  }

  return {
    header: dump.slice(0, 6), // bytes 0–5
    master: dump.slice(6, 14), // bytes 6–13
    tuning: dump.slice(14, 30), // bytes 14–29
    tail: dump[30], // byte 31
  };
}
