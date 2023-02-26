import { Socket } from 'Socket.IO';
import Remote from '@services/Remote';

class Server {
  public socket;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public remoteInstance: any;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  connectClient() {
    this.socket.on('init', async (config) => {
      const remote = new Remote(config);
      try {
        this.remoteInstance = await remote.remoteConnection();
        this.remoteInstance.on('connect', () => {
          this.remoteInstance.updateClipboard('send text to remote clipboard');
        });
        this.remoteInstance.on('error', (error: unknown) => {
          this.socket.emit('error', error);
        });
        this.socket.on('mouse', (event) => {
          this.remoteInstance.pointerEvent(event.x, event.y, event.button);
        });
        this.socket.on('keyboard', (event) => {
          this.remoteInstance.keyEvent(event.keyCode, event.isDown);
        });
        this.socket.on('disconnect', () => {
          this.disconnectClient();
        });
      } catch (error) {
        this.socket.emit('error', error);
      }
    });
    return this.socket;
  }

  // eslint-disable-next-line class-methods-use-this
  disconnectClient() {}
}

export default Server;
