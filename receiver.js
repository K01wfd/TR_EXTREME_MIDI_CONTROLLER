trMIDI.addEventListener('newMessage', (e) => {
  const data = e.detail;
  switch (data[0]) {
    case 0xb0: {
      this.dispatchEvent(
        new CustomEvent('bankChangedOnDevice', { detail: data })
      );
      break;
    }
    case 0xc0: {
      this.dispatchEvent(
        new CustomEvent('patchChangedOnDevice', { detail: data })
      );
      break;
    }
    default: {
      console.log('Channel Untagged message');
      break;
    }
  }
  switch (data[4]) {
    case 0x42: // reply to mode request
      this.dispatchEvent(new CustomEvent('modeRequestReply', { detail: data }));
      break;

    case 0x4e: // mode change from keyboard switch
      this.dispatchEvent(
        new CustomEvent('modeChangedOnDevice', { detail: data })
      );
      break;

    case 0x40:
      this.dispatchEvent(
        new CustomEvent('currentProgReplay', { detail: data })
      );
      break;

    case 0x49:
      this.dispatchEvent(
        new CustomEvent('currentCombiReplay', { detail: data })
      );
      break;

    case 0x6e:
      this.dispatchEvent(new CustomEvent('postProcces', { detail: data }));
      break;

    default:
      console.log('sysEx Untagged message');
      break;
  }
});
