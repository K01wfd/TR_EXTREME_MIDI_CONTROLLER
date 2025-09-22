class tritonMIDI extends EventTarget {
  #access = null;
  #output = null;
  #input = null;
  execCounter = 0;
  constructor() {
    super();
    this.#initConnection();
  }

  changePatchNumber(channel, progNumber) {
    if (!this.#output) return;
    this.#output.send([0xc0 | channel, progNumber]);
  }

  sendMessage(data) {
    if (!this.#output) throw Error('Error sending message, no output');
    this.execCounter++;
    if (!this.#output) throw new Error('Error sending data, no output');
    this.#output.send(data);
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
      alert('✅ MIDI IS SUPPORTED ✅');
      // Notify when ready
      this.dispatchEvent(new CustomEvent('ready'));
    } catch (err) {
      alert('MIDI NOT SUPPORTED 🚫');
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
