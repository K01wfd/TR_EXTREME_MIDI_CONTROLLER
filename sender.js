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
      const dumpTail = modifiedGlobal.slice(30);
      if (portionNum === 1) {
        TRITON_TUNNING_PORTIONS.temp1[index] = value;
        TRITON_TUNNING_PORTIONS.ready1 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp1);
      } else {
        TRITON_TUNNING_PORTIONS.temp2[index] = value;
        TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
      }

      const tunningBody = [...TRITON_TUNNING_PORTIONS.ready1, ...TRITON_TUNNING_PORTIONS.ready2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];

      modifiedGlobal = [...combined];
      trMIDI.sendMessage(modifiedGlobal);
    },
    sendZeroTunning: function () {
      const dumpHeader = modifiedGlobal.slice(0, 14);
      const dumpTail = modifiedGlobal.slice(30);
      const tunningBody = [...TRITON_TUNNING_PORTIONS_DEFAULT.ready1, ...TRITON_TUNNING_PORTIONS_DEFAULT.ready2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      modifiedGlobal = [...combined];
      trMIDI.sendMessage(modifiedGlobal);
    },
    resetGlobal: function () {
      trMIDI.sendMessage(defaultGlobal);
    },
    sendScalePreset: function (scaleType, tunningValue) {
      const dumpHeader = modifiedGlobal.slice(0, 14);
      const dumpTail = modifiedGlobal.slice(30);
      switch (scaleType) {
        case 'BC': {
          TRITON_TUNNING_PORTIONS.temp1[3] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready1 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp1);
          TRITON_TUNNING_PORTIONS.temp2[3] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
          break;
        }
        case 'BD': {
          TRITON_TUNNING_PORTIONS.temp1[5] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready1 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp1);
          TRITON_TUNNING_PORTIONS.temp2[5] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
          break;
        }
        case 'BG': {
          TRITON_TUNNING_PORTIONS.temp1[5] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready1 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp1);
          TRITON_TUNNING_PORTIONS.temp2[3] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
          break;
        }
        case 'BA': {
          TRITON_TUNNING_PORTIONS.temp2[0] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
          TRITON_TUNNING_PORTIONS.temp2[5] = tunningValue;
          TRITON_TUNNING_PORTIONS.ready2 = encode7bitTo8(TRITON_TUNNING_PORTIONS.temp2);
          break;
        }
        default:
          return;
      }

      const tunningBody = [...TRITON_TUNNING_PORTIONS.ready1, ...TRITON_TUNNING_PORTIONS.ready2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      modifiedGlobal = [...combined];
      trMIDI.sendMessage(modifiedGlobal);
    },
    sendTranspose: function (transposeValue) {
      const convertedValue = '0x' + toHex7bit(transposeValue);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      trMIDI.sendMessage(msg);
    },
  },
};

const [insertIndex, msg] = TRITON_CHANGE_MESSAGES.modeChange();

function changeModeMessage(modeText) {
  const modeValue = TRITON_MODES_TO_NUMBERS[modeText];
  msg[insertIndex] = modeValue;
  return msg;
}
