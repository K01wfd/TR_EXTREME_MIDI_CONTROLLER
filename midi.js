class tritonMIDI extends EventTarget {
  #access = null;
  #output = null;
  #input = null;
  constructor() {
    super();
    this.#initConnection();
  }

  changeBank(channel, bank) {
    if (!this.#output) return;

    const currentMode = 0;
    const map = BANKS[currentMode];
    if (!map) throw new Error(`Unknown mode: ${currentMode}`);

    const b = map[bank];
    if (!b) throw new Error(`Unknown bank: ${bank}`);

    // Send CC0 (MSB)
    this.#output.send([0xb0 | channel, 0x00, b.msb]);
    // Send CC32 (LSB)
    this.#output.send([0xb0 | channel, 0x20, b.lsb]);

    this.changePatchNumber(0, 0);
  }

  changePatchNumber(channel, progNumber) {
    if (!this.#output) return;
    this.#output.send([0xc0 | channel, progNumber]);
  }

  sendMessage(data) {
    if (!this.#output) throw new Error('Error sending data, no output');
    this.#input.send(data);
  }

  async #initConnection() {
    try {
      this.#access = await navigator.requestMIDIAccess({ sysex: true });

      // Collect outputs
      this.#access.outputs.forEach((output) => {
        this.#output = output;
      });

      // Collect inputs and add listeners
      this.#access.inputs.forEach((input) => {
        this.#input = input;
        input.onmidimessage = (msg) => this.#handleMIDIMessage(msg);
      });

      // Notify when ready
      this.dispatchEvent(new Event('ready'));
    } catch (err) {
      console.error('❌ Error accessing MIDI:', err);
    }
  }

  #handleMIDIMessage(message) {
    const data = Array.from(message.data);
    if (data[0] === 0xfe || data[0] === 0xf8) return;
    this.dispatchEvent(new CustomEvent('newMessage', { detail: data }));
  }
}

const trMIDI = new tritonMIDI();
