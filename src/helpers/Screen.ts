import EventEmitter from 'events';

class Screen {
  public event = new EventEmitter();

  constructor() {
    this.event.setMaxListeners(1);
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  init(width: number, height: number) {}

  drawFrame(frame: vnc.DrawFrame) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: Screen.ts:13 ~ Screen ~ drawFrame ~ frame:', frame);
    return this.init;
  }

  copyFrame(frame: vnc.CopyFrame) {
    // eslint-disable-next-line no-console
    console.log('🚀 ~ file: Screen.ts:18 ~ Screen ~ copyFrame ~ frame:', frame);
    return this.init;
  }
}

export default Screen;
