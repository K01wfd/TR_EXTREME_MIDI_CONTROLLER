const TRITON_REQUEST_MESSAGES = {
  globalRequest: [0xf0, 0x42, 0x30, 0x50, 0x0e, 0x01, 0xf7],
  modeRequest: [0xf0, 0x42, 0x30, 0x50, 0x12, 0xf7],
  progRequest: [0xf0, 0x42, 0x30, 0x50, 0x10, 0x00, 0xf7],
  combiRequest: [0xf0, 0x42, 0x30, 0x50, 0x19, 0x00, 0xf7],
};

const TRITON_CHANGE_MESSAGES = {
  modeChange: function () {
    const msg = [0xf0, 0x42, 0x30, 0x50, 0x4e, 0x00, 0xf7];
    return [5, msg];
  },
};

const TRITON_MODES_TO_NUMBERS = {
  progModeNumber: 2,
  combiModeNumber: 0,
  globalModeNumber: 7,
};
const TRITON_NUMBER_TO_MODES = {
  0: 'Combination',
  2: 'Program',
  7: 'Global',
};

const BANKS_MESSAGES = {
  0: {
    A: { msb: 0x3f, lsb: 0x00 },
    B: { msb: 0x3f, lsb: 0x01 },
    C: { msb: 0x3f, lsb: 0x02 },
    D: { msb: 0x3f, lsb: 0x03 },
    E: { msb: 0x3f, lsb: 0x04 },
    H: { msb: 0x3f, lsb: 0x08 },
    I: { msb: 0x3f, lsb: 0x09 },
    J: { msb: 0x3f, lsb: 0x0a },
    K: { msb: 0x3f, lsb: 0x0b },
    L: { msb: 0x3f, lsb: 0x0c },
    M: { msb: 0x3f, lsb: 0x0d },
    N: { msb: 0x3f, lsb: 0x0e },
  },
  1: {
    A: { msb: 0x3f, lsb: 0x00 },
    B: { msb: 0x3f, lsb: 0x01 },
    C: { msb: 0x3f, lsb: 0x02 },
    D: { msb: 0x3f, lsb: 0x03 },
    E: { msb: 0x3f, lsb: 0x04 },
    F: { msb: 0x3f, lsb: 0x05 },
    H: { msb: 0x3f, lsb: 0x08 },
    I: { msb: 0x3f, lsb: 0x09 },
    J: { msb: 0x3f, lsb: 0x0a },
    K: { msb: 0x3f, lsb: 0x0b },
    L: { msb: 0x3f, lsb: 0x0c },
    M: { msb: 0x3f, lsb: 0x0d },
    N: { msb: 0x3f, lsb: 0x0e },
  },
};

const BANKS_NUMBERS_TO_LABEL = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
  4: 'E',
  5: 'F',
  8: 'H',
  9: 'I',
  10: 'J',
  11: 'K',
  12: 'L',
  13: 'M',
  14: 'N',
};
const BANKS_LABELS_TO_NUMBERS = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  H: 8,
  I: 9,
  J: 10,
  K: 11,
  L: 12,
  M: 13,
  N: 14,
};
