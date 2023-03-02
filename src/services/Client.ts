import { io as IOClient, Socket } from 'socket.io-client';
import ScreenHandler from '@helpers/ScreenHandler';
import getKeyCode from '@utils/getKeyCode';

class Client extends ScreenHandler {
  public interruptConnection!: (error: unknown) => void;

  public socket!: Socket;

  async connectServer(configuration: vnc.Config, canvas: vnc.Canvas, context: vnc.Context) {
    await fetch('/api/socket');
    this.socket = IOClient();
    this.socket.emit('init', configuration);
    this.socket.on('reconnect', () => {
      this.socket.emit('init', configuration);
    });
    this.socket.on('error', (error) => {
      if (!this.hasHandlers && this.interruptConnection) {
        this.interruptConnection(error);
      } else {
        this.disconnectServer();
        this.emit('error', error);
      }
    });
    return this.socketHandler(canvas, context);
  }

  socketHandler(canvas: vnc.Canvas, context: vnc.Context) {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.disconnectServer();
        reject(new Error('Connect timed out'));
      }, 2000);
      this.interruptConnection = (error) => {
        clearTimeout(timeout);
        this.disconnectServer();
        reject(error);
      };
      this.socket.on('init', (config) => {
        clearTimeout(timeout);
        this.init(
          config.width,
          config.height,
          canvas as HTMLCanvasElement,
          context as CanvasRenderingContext2D,
        );
        this.screenHandler();
        resolve();
      });
      this.socket.on('frame', (frame) => {
        this.drawFrame(frame);
      });
      this.socket.on('copyFrame', (frame) => {
        this.copyFrame(frame);
      });
    });
  }

  screenHandler() {
    if (!this.hasHandlers) throw new Error('Handlers already Exists!');

    this.hasHandlers = true;
    this.on('mouseEvent', this.mouseHandler);
    this.on('keyEvent', this.keyHandler);
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

  disconnectServer() {
    if (this.hasHandlers) {
      this.removeListener('mouseEvent', this.mouseHandler);
      this.removeListener('keyEvent', this.keyHandler);
      this.hasHandlers = false;
    }
    this.removeHandlers();
    this.socket.disconnect();
  }
}

export default Client;
