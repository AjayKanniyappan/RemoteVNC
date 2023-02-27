import { io as IOClient, Socket } from 'socket.io-client';
import Screen from '@helpers/Screen';
import getKeyCode from '@utils/getKeyCode';

class Client {
  public config: vnc.Config;

  public socket!: Socket;

  public screen = new Screen();

  constructor(configuration: vnc.Config) {
    this.config = configuration;
  }

  async connectServer() {
    await fetch('/api/socket');
    this.socket = IOClient();
    this.socket.emit('init', this.config);
    this.socket.on('reconnect', () => {
      this.socket.emit('init', this.config);
    });
    return this.socketHandler();
  }

  socketHandler() {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.disconnect();
        reject(new Error('Connect timed out'));
      }, 2000);
      /*  self._interruptConnect = (error) => {
        clearTimeout(timeout);
        this.disconnect();
        reject(error);
      }; */
      this.socket.on('init', (config) => {
        clearTimeout(timeout);
        this.screen.init(config.width, config.height);
        this.screenHandler();
        resolve();
      });
      this.socket.on('frame', (frame) => {
        this.screen.drawFrame(frame);
      });
      this.socket.on('copyFrame', (frame) => {
        this.screen.copyFrame(frame);
      });
    });
  }

  screenHandler() {
    this.screen.event.on('mouseEvent', this.mouseHandler);
    this.screen.event.on('keyEvent', this.keyHandler);
  }

  mouseHandler(x: number, y: number, button: number) {
    this.socket.emit('mouse', { x, y, button });
  }

  keyHandler(code: number, shift: number, isDown: number) {
    const keyCode = getKeyCode(code, shift);
    if (keyCode) {
      this.socket.emit('keyboard', { keyCode, isDown });
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
}

export default Client;
