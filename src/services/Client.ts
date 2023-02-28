import { io as IOClient, Socket } from 'socket.io-client';
import getKeyCode from '@utils/getKeyCode';

class Client {
  public config: vnc.Config;

  public interruptConnection!: (error: unknown) => void;

  public socket!: Socket;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public screen: any;

  constructor(configuration: vnc.Config, screen: unknown) {
    this.config = configuration;
    this.screen = screen;
  }

  async connectServer() {
    await fetch('/api/socket');
    this.socket = IOClient();
    this.socket.emit('init', this.config);
    this.socket.on('reconnect', () => {
      this.socket.emit('init', this.config);
    });
    this.socket.on('error', (error) => {
      if (/* !this.screen.hasHandlers && */ this.interruptConnection) {
        this.interruptConnection(error);
      } else {
        this.disconnect();
        this.screen.event.emit('error', error);
      }
    });
    return this.socketHandler();
  }

  socketHandler() {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.disconnect();
        reject(new Error('Connect timed out'));
      }, 2000);
      this.interruptConnection = (error) => {
        clearTimeout(timeout);
        this.disconnect();
        reject(error);
      };
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
